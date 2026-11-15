
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "node:fs";
import * as path from "node:path";

const serviceAccountPath: string = path.resolve(
    process.cwd(),
    "serviceAccountKey.json"
);

const serviceAccount: object = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
);

initializeApp({
    credential: cert(serviceAccount),
});

export const db: FirebaseFirestore.Firestore = getFirestore();
