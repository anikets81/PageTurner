import { firebaseApp } from "../firebase-config";
//prettier-ignore
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore"

// fetch all docs from firebase
export const getAllFeeds = async (firestoreDb) => {
  const feeds = await getDocs(
    query(collection(firestoreDb, "Images"), orderBy("id", "desc"))
  );

  return feeds.docs.map((doc) => doc.data());
};

//fetch the user info using user id

export const getUserInfo = async (firestoreDb, userId) => {
  const userRef = doc(firestoreDb, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return "No Such Document";
  }
};

// fetch the specific story

export const getSpecificStory = async (firestoreDb, imgId) => {
  const imgRef = doc(firestoreDb, "Images", imgId);
  const imgSnap = await getDoc(imgRef);
  if (imgSnap.exists()) {
    return imgSnap.data();
  } else {
    return "No Such Document";
  }
};

export const deleteStory = async (firestoreDb, storyId) => {
  await deleteDoc(doc(firestoreDb, "Images", storyId));
};

// category wise feeds
export const categoryFeeds = async (firestoreDb, categoryId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, "Images"),
      where("categories", "==", categoryId),
      orderBy("id", "desc")
    )
  );

  return feeds.docs.map((doc) => doc.data());
};

// get recommended feeds

export const recommended = async (firestoreDb, categoryId, storyId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, "Images"),
      where("categories", "==", categoryId),
      where("id", "!=", storyId),
      orderBy("id", "desc")
    )
  );

  return feeds.docs.map((doc) => doc.data());
};

export const userUploadedStories = async (firestoreDb, userId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, "Images"),
      where("userId", "==", userId),
      orderBy("id", "desc")
    )
  );

  return feeds.docs.map((doc) => doc.data());
};
