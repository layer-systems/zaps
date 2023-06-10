const pool = new window.NostrTools.SimplePool();
let relays = ["wss://relay.nostr.band"];

nostrGetZaps();

async function nostrGetZaps() {
    let sub = pool.sub([...relays], [
        {
            kinds: [9735],
        }
    ])
    sub.on('event', data => {
        // Only show posts without tags (no replies, etc.)
        // if(data.tags.length != 0) {
        //     return;
        // }

        // console.log(data)
        console.log("Sender: " + data.pubkey)
        // console.log(data.tags['p'])
        for(let i = 0; i < data.tags.length; i++) {
            if(data.tags[i][0].startsWith('p')) {
                console.log("Receiver: " + data.tags[i][1])
            }
        }

        // ---------------------------------------------------------------------
        // ---------------------------------------------------------------------
        // ---------------------------------------------------------------------

        // const content = data.content;

        // var divCol = document.createElement('div');
        // divCol.setAttribute('class', 'col');
        // var divCard = document.createElement('div');
        // divCard.setAttribute('class', 'card shadow-sm');
        // var divCardBody = document.createElement('div');
        // divCardBody.setAttribute('class', 'card-body');
        // var pCardText = document.createElement('p');
        // pCardText.setAttribute('class', 'card-text');
        // pCardText.innerHTML = content;
        // var smallText = document.createElement('small');
        // smallText.setAttribute('class', 'text-body-secondary');
        // smallText.innerHTML = "formattedTime";

        // var smallTextId = document.createElement('small');
        // smallTextId.setAttribute('class', 'text-body-secondary');
        // smallTextId.innerHTML = "id";

        // divCardBody.appendChild(pCardText);

        // divCard.appendChild(divCardBody);
        // divCol.appendChild(divCard);
        // document.getElementById('content').appendChild(divCol);
    })
    sub.on('eose', () => {
        sub.unsub()
    })
}