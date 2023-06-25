const pool = new window.NostrTools.SimplePool();
// let relays = ["wss://relay.nostr.band"];
let relays = ["wss://relay.damus.io", "wss://relay.nostr.band", "wss://relay.layer.systems"];

nostrGetZaps();

async function nostrGetZaps() {
    let sub = pool.sub([...relays], [
        {
            kinds: [9735],
            limit: 10,
        }
    ])
    sub.on('event', data => {
        // console.log(data);
        sats = 0;

        const createdAt = data.created_at;
        const sender = data.pubkey;
        let receiver = ""
        let formattedCreatedAt = new Date(createdAt * 1000).toLocaleString();

        for(let i = 0; i < data.tags.length; i++) {
            if(data.tags[i][0].startsWith('p')) {
                receiver = data.tags[i][1];
            }
            if(data.tags[i][0] == ('bolt11')) {
                bolt11 = data.tags[i][1];
                // console.log(bolt11);
                // sats = bolt11.match(/^lnbc(\d+)/)[1];
                // Remove first 4 characters i.e. 'lnbc'
                let inputStrWithoutPrefix = bolt11.slice(4);
                // Get the number after 'lnbc'
                let numberAfterPrefix = parseInt(bolt11.slice(4).match(/\d+/)[0]);
                // Get the first letter after the number
                let letterAfterNumber = inputStrWithoutPrefix.charAt(inputStrWithoutPrefix.search(/[a-zA-Z]/));
                if(letterAfterNumber == 'm') {
                    sats = Math.round((numberAfterPrefix * 0.001) * 100000000);
                } else if(letterAfterNumber == 'u') {
                    sats = Math.round((numberAfterPrefix * 0.000001) * 100000000);
                } else if(letterAfterNumber == 'n') {
                    sats = Math.round((numberAfterPrefix * 0.000000001) * 100000000);
                } else if(letterAfterNumber == 'p') {
                    sats = Math.round((numberAfterPrefix * 0.000000000001) * 100000000);

                }
            }
        }


        // Create the outer div with class "card m-2"
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

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

        // Create the date placeholder div element with class "card-date"
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("card-date");
        dateDiv.textContent = formattedCreatedAt;

        // Append all the elements together to form the structure
        cardBodyDiv.appendChild(senderH5);
        cardBodyDiv.appendChild(satoshiP);
        cardBodyDiv.appendChild(receiverH5);
        cardBodyDiv.appendChild(dateDiv); // add date element
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