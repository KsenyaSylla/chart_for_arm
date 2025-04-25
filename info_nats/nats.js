import { ref } from 'vue';
import { connect, StringCodec } from "nats.ws";


function processEntry(entry, sc, data) {
  try {
    let s = sc.decode(entry.value);
    let receivedData = JSON.parse(s);

    data.value.dataFromNATS=[]
    let keys = Object.keys(receivedData).sort();
    for (let i=0; i<keys.length; i++) {
      data.value.dataFromNATS.push(receivedData[keys[i]])
    }

    data.value.loading = false;
    data.value.generalError = false;
    data.value.cannotConnect = false;
    data.value.inlvalidProject = false;
    data.value.deletedValue = false;
    data.value.invalidJSON = false;
  } catch (error) {
    data.value.loading = false;
    data.value.generalError = false;
    data.value.cannotConnect = false;
    data.value.inlvalidProject = false;
    data.value.deletedValue = false;
    data.value.invalidJSON = true;
    console.error("JSON processing error:", error);
  }
}


async function read(watch, sc, project, data) {
  for await (const e of watch) {
    data.value.loading = false;
    console.log(`update op=${e.operation}`, e);
    if (e.key === project) {
      if (e.operation === "DEL") {
        data.value.loading = false;
        data.value.generalError = false;
        data.value.cannotConnect = false;
        data.value.deletedValue = true;
        data.value.inlvalidProject = false;
        data.value.invalidJSON = false;
      } else {
        processEntry(e, sc, data);
      }
    }
  }
}


function handleError(err, config, data) {
  console.log('Error:', err);
  if (err.name === "NatsError") {
    data.value.loading = false;
    data.value.generalError = false;
    data.value.cannotConnect = true;
    data.value.inlvalidProject = false;
    data.value.deletedValue = false;
    data.value.invalidJSON = false;
  } else {
    data.value.loading = false;
    data.value.generalError = true;
    data.value.cannotConnect = false;
    data.value.inlvalidProject = false;
    data.value.deletedValue = false;
    data.value.invalidJSON = false;
  }
  setTimeout(()=>start(config, data), config.reconnectDelay || 5000);
}


async function do_connect({URL, user, pass, organization, project}, data) {
      const nc = await connect({
        servers: [URL],
        user: user,
        pass: pass,
      });
      const sc = StringCodec();
      const js = nc.jetstream();
      const kv = await js.views.kv(organization, { history: 1 });

      // Set up watch for future changes
      const watch = await kv.watch();
      await read(watch, sc, project, data);
}


function start({URL, user, pass, organization, project, reconnectDelay}, data) {
  if (!data) data = ref({
    loading: true,
    generalError: false,
    cannotConnect: false,
    inlvalidProject: false,
    deletedValue: false,
    invalidJSON: false,
    dataFromNATS: []
  })

  do_connect({URL, user, pass, organization, project}, data)
  .catch(err=>{
    handleError(err, {URL, user, pass, organization, project, reconnectDelay}, data);
  })

  return data;
}


export {
  start
}
