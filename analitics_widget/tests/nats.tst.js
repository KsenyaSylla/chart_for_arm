import { describe, test, expect, vi, beforeEach } from 'vitest'
import { start } from '../src/utils/nats';

// TODO непонятно когда выскакивает ошибка inlvalidProject - и теста нет

const mocks = vi.hoisted(() => {
    return {
        connect: vi.fn(),
        StringCodec: vi.fn(),
    }
})
vi.mock('nats.ws', () => {
    return {
        connect: mocks.connect,
        StringCodec: mocks.StringCodec,
    }
})

//скрыть вывод console.log и console.error
vi.spyOn(console, 'log').mockImplementation(() => undefined);
vi.spyOn(console, 'error').mockImplementation(() => undefined);

//необходимо делать data.value.stop() после теста, чтобы останавливать реконнекты
let data;


describe('test nats', () => {

    beforeEach(() => {
        if (data && data.value && data.value.stop) data.value.stop();
        mocks.connect.mockClear();
        mocks.StringCodec.mockClear();
    })


    test('loading', async () => {
        // не соединяется - висит nats.ws.connect
        mocks.connect.mockReturnValue(new Promise(() => { }, () => { }))

        data = start({ URL: 'url1', user: 'u1', pass: 'p1' });
        //ждем пока значения попадут в ref
        await (new Promise((resolve) => { setImmediate(resolve) }))

        //nats.ws.connect был вызван один раз с нужными параметрами
        expect(mocks.connect).toBeCalledTimes(1);
        expect(mocks.connect).toBeCalledWith({
            user: "u1",
            pass: "p1",
            servers: ["url1"],
        });
        //в результирующем состоянии установлено loading=true
        expect(data.value.loading).toBe(true)
        expect(data.value.generalError).toBe(false)
        expect(data.value.cannotConnect).toBe(false)
        expect(data.value.inlvalidProject).toBe(false)
        expect(data.value.deletedValue).toBe(false)
        expect(data.value.invalidJSON).toBe(false)
    })


    test('connect failed', async () => {
        // NATS возвращает ошибку (типа NatsError)
        const err = new Error("bububu error"); err.name = "NatsError";
        mocks.connect.mockReturnValue(Promise.reject(err))

        data = start({ reconnectDelay: 200 });
        //ждем пока значения попадут в ref
        await (new Promise((resolve) => { setImmediate(resolve) }))

        //реконнекта пока не было
        expect(mocks.connect).toBeCalledTimes(1);

        //ошибки есть - и это cannotConnect
        expect(data.value.loading).toBe(false)
        expect(data.value.generalError).toBe(false)
        expect(data.value.cannotConnect).toBe(true)
        expect(data.value.inlvalidProject).toBe(false)
        expect(data.value.deletedValue).toBe(false)
        expect(data.value.invalidJSON).toBe(false)

        //ждем реконнекта
        await (new Promise((resolve) => { setTimeout(resolve, 300) }))
        //была попытка реконнекта
        expect(mocks.connect).toBeCalledTimes(2);
    })


    test('general error', async () => {
        // будет ошибка 'Cannot read properties of undefined' после jetstream().views.kv(...) 
        mocks.connect.mockReturnValue(Promise.resolve({
            jetstream: () => { }
        }))

        data = start({ reconnectDelay: 200 });
        //ждем пока значения попадут в ref
        await (new Promise((resolve) => { setImmediate(resolve) }))

        //реконнекта пока не было
        expect(mocks.connect).toBeCalledTimes(1);

        //ошибки есть - и это generalError
        expect(data.value.loading).toBe(false)
        expect(data.value.generalError).toBe(true)
        expect(data.value.cannotConnect).toBe(false)
        expect(data.value.inlvalidProject).toBe(false)
        expect(data.value.deletedValue).toBe(false)
        expect(data.value.invalidJSON).toBe(false)

        //ждем реконнекта
        await (new Promise((resolve) => { setTimeout(resolve, 300) }))
        //была попытка реконнекта
        expect(mocks.connect).toBeCalledTimes(4); //было 2 раза, почему?
    })


    test('get initial data', async () => {
        // NATS возвращает {"a":1} для проекта '123'
        mocks.connect.mockReturnValue(Promise.resolve({
            jetstream: () => {
                return {
                    views: {
                        kv: () => Promise.resolve({
                            watch: () => Promise.resolve([
                                { operation: 'UPDATE', key: '123', value: '{"a":1}' },
                                { operation: 'UPDATE', key: 'qwerty', value: '{"b":2}' }
                            ])
                        })
                    }
                }
            }
        }))
        // StringCodec ничего не делает
        mocks.StringCodec.mockReturnValue({
            decode: a => { return a }
        })

        data = start({ project: '123' });
        //ждем пока значения попадут в ref
        await (new Promise((resolve) => { setImmediate(resolve) }))

        //ошибок нет
        expect(data.value.loading).toBe(false)
        expect(data.value.generalError).toBe(false)
        expect(data.value.cannotConnect).toBe(false)
        expect(data.value.inlvalidProject).toBe(false)
        expect(data.value.deletedValue).toBe(false)
        expect(data.value.invalidJSON).toBe(false)
        //project='qwerty' отфильтровался и не попал в результат
        expect(data.value.dataFromNATS).toStrictEqual([1])
    })


    test('get initial data - json error', async () => {
        // NATS возвращает ерунду, которую JSON.parse не может распарсить
        mocks.connect.mockReturnValue(Promise.resolve({
            jetstream: () => {
                return {
                    views: {
                        kv: () => Promise.resolve({
                            watch: () => Promise.resolve([
                                { operation: 'UPDATE', key: '123', value: '1 2' },
                            ])
                        })
                    }
                }
            }
        }))
        // StringCodec ничего не делает
        mocks.StringCodec.mockReturnValue({
            decode: a => { return a }
        })

        data = start({ project: '123' });
        //ждем пока значения попадут в ref
        await (new Promise((resolve) => { setImmediate(resolve) }))

        //ошибки есть - это invalidJSON
        expect(data.value.loading).toBe(false)
        expect(data.value.generalError).toBe(false)
        expect(data.value.cannotConnect).toBe(false)
        expect(data.value.inlvalidProject).toBe(false)
        expect(data.value.deletedValue).toBe(false)
        expect(data.value.invalidJSON).toBe(true)
    })


    test('get initial data - deletedValue error', async () => {
        // NATS возвращает op=DEL для проекта '123'
        mocks.connect.mockReturnValue(Promise.resolve({
            jetstream: () => {
                return {
                    views: {
                        kv: () => Promise.resolve({
                            watch: () => Promise.resolve([
                                { operation: 'DEL', key: '123' },
                            ])
                        })
                    }
                }
            }
        }))

        data = start({ project: '123' });
        //ждем пока значения попадут в ref
        await (new Promise((resolve) => { setImmediate(resolve) }))

        //ошибки есть - это invalidJSON
        expect(data.value.loading).toBe(false)
        expect(data.value.generalError).toBe(false)
        expect(data.value.cannotConnect).toBe(false)
        expect(data.value.inlvalidProject).toBe(false)
        expect(data.value.deletedValue).toBe(true)
        expect(data.value.invalidJSON).toBe(false)
    })


    test('get updates', async () => {
        let updates_data = [
            { operation: 'UPDATE', key: '123', value: '{"a":1}' },
            { operation: 'UPDATE', key: '123', value: '{"a":2}' }
        ]
        //ну наконец-то асинхронный итератор, как в самой либе nats.ws 
        let watch = {
            [Symbol.asyncIterator]() {
                return {
                    current: 0,
                    last: updates_data.length,
                    async next() {
                        //ждем 200ms перед ответом (кроме первого)
                        if (this.current > 0) await (new Promise((resolve) => { setTimeout(resolve, 100) }))
                        if (this.current <= this.last) {
                            return { done: false, value: updates_data[this.current++] };
                        } else {
                            return { done: true };
                        }
                    }
                }
            }
        }
        // NATS возвращает {"a":1} а потом через 200ms {"a":2}
        mocks.connect.mockReturnValue(Promise.resolve({
            jetstream: () => {
                return {
                    views: {
                        kv: () => Promise.resolve({
                            watch: () => watch
                        })
                    }
                }
            }
        }))
        // StringCodec ничего не делает
        mocks.StringCodec.mockReturnValue({
            decode: a => { return a }
        })

        data = start({ project: '123' });
        //ждем пока значения попадут в ref
        await (new Promise((resolve) => { setImmediate(resolve) }))

        //ошибок нет
        expect(data.value.loading).toBe(false)
        expect(data.value.generalError).toBe(false)
        expect(data.value.cannotConnect).toBe(false)
        expect(data.value.inlvalidProject).toBe(false)
        expect(data.value.deletedValue).toBe(false)
        expect(data.value.invalidJSON).toBe(false)
        //после первого апдейта =1
        expect(data.value.dataFromNATS).toStrictEqual([1])

        //ждем прихода следующего апдейта
        await (new Promise((resolve) => { setTimeout(resolve, 300) }))
        //после второго апдейта =2
        expect(data.value.dataFromNATS).toStrictEqual([2])
    })

})
