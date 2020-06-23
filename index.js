const { VK } = require('vk-io');
const fs = require('fs');
const { random } = require("lodash")




const vk = new VK;vk.setOptions({token: 'token', apiMode: 'parallel'});  

const ids = []

Array.prototype.chunk = function(groupsize){
    let sets = [], chunks, i = 0;
    chunks = Math.ceil(this.length / groupsize);

    while(i < chunks){
        sets[i] = this.splice(0, groupsize);
	i++;
    }
    return sets;
};


const idsgenerator = async (offset) => {

    if (typeof offset == 'undefined') {
        offset = await vk.api.messages.getConversations({
            count: 1
        }).then(a => a.count)
    }
    for (let i = 0; i < offset; i++) { 
        offset -= 1
        try {

            let test = await vk.api.messages.getConversations({
                count: 1,
                offset: offset
            }).then(a => a.items.map(x => x.conversation.peer.id))

            ids.push(test.shift())

        } catch {
           await idsgenerator(offset)
        }
    }
    fs.writeFileSync('userIDS.json',JSON.stringify(ids))

    return request_value_generator('polak123');
    
}



const request_value_generator = (message) => {

    const base = require('./userIDS.json')

    let chunked_ids = base.chunk(100)

    const executeParams = chunked_ids.map((id) => ({
        peer_ids: id,
        message,
        random_id: random(1, 999999)
    }))


    
    return mailer(executeParams);
}


const mailer = async (request) => {

    return vk.collect.executes('messages.send', request)

}
