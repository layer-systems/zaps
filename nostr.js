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

        // Append all the elements together to form the structure
        cardBodyDiv.appendChild(senderH5);
        cardBodyDiv.appendChild(satoshiP);
        cardBodyDiv.appendChild(receiverH5);
        cardDiv.appendChild(cardBodyDiv);

        // Append the card div to the body of the document
        document.getElementById('cards').appendChild(cardDiv);
        
    })
    sub.on('eose', () => {
        // sub.unsub()
    })
}

// async function nostrGetUsername(authors) {
//     let userNamesub = pool.sub([...relays], [
//         {
//             kinds: [1],
//         }
//     ])
//     userNamesub.on('event', data => {
//         console.log(data);
//         // return data;
//     })
//     userNamesub.on('eose', () => {
//         sub.unsub()
//     })
// }