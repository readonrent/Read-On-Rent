const { MongoClient, ServerApiVersion } = require('mongodb');

let clientPromise;

function getClientPromise() {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI environment variable.');

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    },
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 10000
  });

  clientPromise = client.connect().catch((err) => {
    clientPromise = undefined;
    throw err;
  });

  return clientPromise;
}

function getDbName() {
  return process.env.MONGODB_DB_NAME || 'readon_rent';
}

const defaultData = () => ({
  meetings: [],
  backlog: [],
  sprints: [],
  dailyscrum: [],
  sprintreview: [],
  retrospective: [],
  testing: [],
  team: { projectName: '', members: [] },
  teamProgressMap: {}
});

function normalizeData(parsed = {}) {
  const base = defaultData();
  return {
    ...base,
    ...parsed,
    team: { ...base.team, ...(parsed.team || {}) },
    teamProgressMap: { ...(parsed.teamProgressMap || {}) }
  };
}

async function getCollection() {
  const client = await getClientPromise();
  return client.db(getDbName()).collection('dashboard_state');
}

async function loadData() {
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: 'main' });
  if (!doc) return defaultData();
  return normalizeData(doc.payload || {});
}

const { prepareForStorage } = require('./supabase-storage');

async function saveData(data) {
  const prepared = await prepareForStorage(normalizeData(data));
  const collection = await getCollection();
  await collection.replaceOne(
    { _id: 'main' },
    { _id: 'main', payload: prepared, updatedAt: new Date() },
    { upsert: true }
  );
}

async function pingDatabase() {
  const client = await getClientPromise();
  await client.db('admin').command({ ping: 1 });
  return true;
}

module.exports = { getClientPromise, getDbName, loadData, saveData, pingDatabase, defaultData, normalizeData };
