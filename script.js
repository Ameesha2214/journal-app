const firebaseConfig = {
    apiKey: "AIzaSyA30trjZnQD3zwEeQlMNHI_HTYtHM6_g1A",
    authDomain: "journal-app-c83bf.firebaseapp.com",
    projectId: "journal-app-c83bf",
    storageBucket: "journal-app-c83bf.appspot.com",
    messagingSenderId: "19253744464",
    appId: "1:19253744464:web:27a3d652a7eda13246d255"
  };
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(app);
const db = firebase.firestore(app);

function addJournalEntry() {
    const entryText = document.getElementById("journal-entry").value;
    const user = firebase.auth().currentUser;
    const today = new Date().toISOString().slice(0, 10);

    if (user && entryText.trim() !== "") {
        // db.collection("journalEntries")
        //     .where("userId", "==", user.uid)
        //     .where("date", "==", today)
        //     .get()
        //     .then((querySnapshot) => {
                // if (querySnapshot.empty) {

                    db.collection("journalEntries").add({
                        text: entryText,
                        userId: user.uid,
                        date: today,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        console.log("Entry added successfully");
                        document.getElementById("journal-entry").value = ""; // Clear the textarea
                        displayJournalEntries(); // Refresh the entries display
                    }).catch((error) => {
                        console.error("Error adding entry: ", error);
                    });

                // } else {
                //     alert("You have already written a journal entry for today.");
                // }
//             });
//     } 
//     else {
//         alert("Please sign in and write something in your journal.");
 }
}

function displayJournalEntries() {
    const user = firebase.auth().currentUser;
    const entriesContainer = document.getElementById("journal-entries");
    entriesContainer.innerHTML = ""; // Clear previous entries

    if (user) {
        db.collection("journalEntries")
            .where("userId", "==", user.uid)
            .orderBy("date", "desc")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const entry = doc.data();
                    const entryElement = document.createElement("div");
                    entryElement.classList.add("journal-entry");
                    entryElement.innerHTML = `<strong>${entry.date}:</strong> ${entry.text}`;
                    entriesContainer.appendChild(entryElement);
                });
            }).catch((error) => {
                console.error("Error getting entries: ", error);
            });
    }
}

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("User signed out");
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
}

var uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            return false; // Avoid redirects after sign-in
        }
    }
};



// Initialize the FirebaseUI Widget
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("journal-app").style.display = "block";
        displayJournalEntries();
    } else {
        document.getElementById("journal-app").style.display = "none";
    }
});

