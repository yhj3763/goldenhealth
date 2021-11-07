import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth"; //import authorcation
import { AngularFirestore } from "@angular/fire/compat/firestore"; //import the firestore database
@Injectable({
  providedIn: 'root',
})
export class FireserviceService {

  constructor(
    public firestore: AngularFirestore,
    public auth: AngularFireAuth
  ) { }

  loginWithEmail(data) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  logout(){
    this.auth.signOut();
  }
  
  signup(data) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.password);
  }

  saveDetails(data) {
    return this.firestore.collection("users").doc(data.uid).collection('PersonalInfo').doc(data.uid).set(data);
  }
  saveDiet(data) {
    return this.firestore.collection("users").doc(data.uid).
    collection("diet").doc(data.uid).collection(data.Date).doc(data.DateType).set(data);
  }
  savetaget(data){
    return this.firestore.collection("users").doc(data.uid).
    collection("diet").doc(data.uid).collection(data.Date+":Target").doc('TargetCalories').set(data);
  }
  saveActivity(data) {
    return this.firestore.collection("users").doc(data.uid)
    .collection("activity").doc(data.uid).collection(data.Date).doc(data.DateType).set(data);
  }
  getDetails(data) {
    return this.firestore.collection("users").doc(data.uid).collection('PersonalInfo').doc(data.uid).valueChanges();
  }
}

