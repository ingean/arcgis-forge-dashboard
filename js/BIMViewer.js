import { sections } from './config.js'
import { updateBIMVisualizations } from './dashboard/visualizations/BIMData.js';
import { currentPhase, currentSection } from './changeSelection.js';

const clientId = 'yvANRrDF1Omdkgd8HXHdJwME2DWxNX9u'
const clientSecret = 'TL8xzPUfzxOqGOHk'
//const tokenURL = 'https://developer.api.autodesk.com/authentication/v1/authenticate'


//const clientId = '6dzViv7SzGuiKqXGRJWTDoGY56Hc3vTu7sAByLG0sYfAX4Kf'
//const clientSecret = 'HTs0Q8AjMFO8WfueUJ8pbFGuao9YYZxgVxE4Krbtl5Fk7meU758gctYR11N3OFnJ'
const tokenURL = 'https://developer.api.autodesk.com/authentication/v2/token'

let accessToken = '';
let viewer;
export var modelProperties = {};

export const init = () => {
  let options = {
    env: 'AutodeskProduction',
    api: 'derivativeV2',  // for models uploaded to EMEA change this option to 'derivativeV2_EU'
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    let BIMDiv = document.getElementById('BIMviewDiv');
    viewer = new Autodesk.Viewing.GuiViewer3D(BIMDiv);
    let startedCode = viewer.start();
    if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
    }

    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onViewerLoadComplete)
    viewer.setLightPreset(2)
    viewer.setEnvMapBackground(false)
    loadDocument(5)
  })
}

const onViewerLoadComplete = async () => {
  let data = await getProperties()
  isolatePhase()
  updateBIMVisualizations()
}

const getForgeToken = (callback) => {
  let data = new URLSearchParams();
  data.append("client_id", clientId);
  data.append("client_secret", clientSecret);
  data.append("grant_type", "client_credentials");
  //data.append("scope", "code:all data:write data:read bucket:create bucket:delete bucket:read");
  data.append("scope", "viewables:read");

  fetch(tokenURL, {
    "method": 'POST',
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
    },
    "body": data
  })
  .then(res => {
    res.json().then(data => {
      accessToken = data.access_token;
      callback(data.access_token, data.expires_in);
    });
  });
}

export const loadDocument = (section) => {
  let documentId = sections?.[section]?.docId
  if (documentId) {
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure)
  }
}

const onDocumentLoadSuccess = (viewerDocument) => {
  console.log('Model manifest document loaded successfully!')
  let defaultModel = viewerDocument.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(viewerDocument, defaultModel);
}

const onDocumentLoadFailure = (errCode, errMsg) => {
  console.error('Failed to load manifest [' + errCode + '] ' + errMsg);
}

const getProperties = () => {
  return new Promise((resolve, reject) => {
    viewer.model.getPropertyDb().executeUserFunction(userFunction)
    .then(data => {
      if (data?.parts?.[1]) {
        modelProperties = data;
        viewer.fitToView(data.parts[1]);
      } else {
        console.log("Model doesn't contain property 'Fremdrift === 1'.");
        return
      }
      resolve(data)
    })
    .catch(error => {
      console.log("Failed to get properties from model!")
      console.log(error);
      reject(error)
    })
  })
}


//Runs in worker thread not able to debug with Chrome
function userFunction(pdb) {
  let attrIdProgress = -1;
  let attrIdVolume = -1;

  pdb.enumAttributes((i, attrDef, attrRaw) => { //Find index for property 'Fremdrift'
    if (attrDef.name === 'Fremdrift') {
      attrIdProgress = i; 
    } else if (attrDef.name === 'Volume') {
      attrIdVolume = i;
    }
  });

  if (attrIdProgress === -1 && attrIdVolume === -1) {
    console.log('Found neither Fremdrift nor Volume attributes');
    return null;
  } 
    
  let data = {
    parts: {},
    volume: {}
  };

  pdb.enumObjects(dbId => {
    let phase = -1;
    pdb.enumObjectProperties(dbId, (attrId, valId) => {
      if (attrId === attrIdProgress) { // Only process 'Fremdrift' property.
        let value = pdb.getAttrValue(attrId, valId);
        phase = value;

        if(data.parts.hasOwnProperty(value)) {
          data.parts[value].push(dbId); 
        } else {
          data.parts[value] = [dbId];
        }
        return true;
      }
    });
    pdb.enumObjectProperties(dbId, (attrId, valId) => {
      if (attrId === attrIdVolume) { // Only process 'Volume' property.
        let value = pdb.getAttrValue(attrId, valId);
        if (!isNaN(value)) {
          value = Number(value);
          if(data.volume.hasOwnProperty(phase)) {
            data.volume[phase] = data.volume[phase] + value; 
          } else {
            data.volume[phase] = value;
          }
        }
        return true;
      }
    });
  });

  return data;
}

export const isolatePhase = (section, phase) => {
  section = (section) ? section : currentSection()
  phase = (phase) ? phase : currentPhase()
  
  if (section !== 5) return // Only section 5 has phase info in BIM-model

  let modelIds = []
  
  for (var i = 1; i <= phase; i++) {
    modelIds = modelIds.concat(modelProperties.parts[i])
  }
  viewer.isolate(modelIds);
}

export const getModelProperties = () => {
  return modelProperties
}

export const resizeBIMViewer = () => {
  viewer.resize()
}