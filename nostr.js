const pool = new window.NostrTools.SimplePool();
// let relays = ["wss://relay.nostr.band"];
let relays = ["wss://relay.damus.io"];

nostrGetZaps();

async function nostrGetZaps() {
    let sub = pool.sub([...relays], [
        {
            kinds: [9735],
            limit: 1,
        }
    ])
    sub.on('event', data => {
        // console.log(data);
        sats = 0;

        const sender = data.pubkey;
        let receiver = ""
        for(let i = 0; i < data.tags.length; i++) {
            if(data.tags[i][0].startsWith('p')) {
                receiver = data.tags[i][1];
            }
            if(data.tags[i][0] == ('bolt11')) {
                bolt11 = data.tags[i][1];
                console.log(bolt11);
                sats = bolt11.match(/^lnbc(\d+)/)[1];
            }
        }


        // Create the outer div with class "card m-2"
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card", "m-2");

        // Create the inner div with class "card-body"
        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");

        // Create the sender placeholder h5 element with class "card-title"
        const senderH5 = document.createElement("h5");
        senderH5.classList.add("card-title");
        senderH5.textContent = sender;
        senderH5.id = sender;

        // Create the lightning bolt icon element
        const lightningIcon = document.createElement("i");
        lightningIcon.classList.add("bi", "bi-lightning-fill");

        // Create the p element with the satoshi amount and lightning icon
        const satoshiP = document.createElement("p");
        satoshiP.textContent = "⚡️ " + sats + " sats";
        satoshiP.prepend(lightningIcon);

        // Create the receiver placeholder h5 element with class "card-title"
        const receiverH5 = document.createElement("h5");
        receiverH5.classList.add("card-title");
        receiverH5.textContent = receiver;
        receiverH5.id = receiver;

        // Append all the elements together to form the structure
        cardBodyDiv.appendChild(senderH5);
        cardBodyDiv.appendChild(satoshiP);
        cardBodyDiv.appendChild(receiverH5);
        cardDiv.appendChild(cardBodyDiv);

        // Insert the card div to the body of the document
        document.getElementById('cards').insertBefore(cardDiv, document.getElementById('cards').firstChild);

        // Get the username of the sender and receiver
        nostrGetUserinfo(sender);
        nostrGetUserinfo(receiver);
    })
    sub.on('eose', () => {
        // sub.unsub()
    })
}

async function nostrGetUserinfo(pubkey) {
    let sub = pool.sub([...relays], [
        {
            kinds: [0],
            authors: [pubkey],
            limit: 1
        }
    ])
    sub.on('event', data => {
        const username = JSON.parse(data.content)['username'];
        const displayName = JSON.parse(data.content)['displayName'];
        const name = JSON.parse(data.content)['name'];

        usernameElement = document.getElementById(pubkey);

        if (typeof displayName !== "undefined") {
            usernameElement.textContent = `${displayName}`;
        } else if (typeof name !== "undefined") {
            usernameElement.textContent = `${name}`;
        } else {
            usernameElement.textContent = `${username}`;
        }
    })
    sub.on('eose', () => {
        sub.unsub()
    })
}