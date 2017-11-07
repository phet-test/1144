const Command = require('./command');
const { Message, OpType, Location, Profile } = require('../curve-thrift/line_types');

class LINE extends Command {
    constructor() {
        super();
        this.receiverID = '';
        this.checkReader = [];
        this.stateStatus = {
            cancel: 0,
            kick: 0,
            qrp: 0,
            autokick: 0,
        };
        this.messages;
        this.payload;
        this.stateUpload =  {
                file: '',
                name: '',
                group: '',
                sender: ''
            }
    }


    get myBot() {
        const bot = ['u00f827ce6641038d7c9b6704a9777dfa','ua762662a25bde98ce0007a45a025a337','ua28beb5bdd95caf9b27d18728272f3e5','uc7ce1695635ca898c14a97f48074350f','uff6da4986b580124dd151187fffe1ca6','ucf3ff0c473c68c1612e1e7c18802e52a','u328b20d6685b0895589b44c96cace113','u391d45a8c82a23601bb12ba778a57185','u408e26413c07b6c76ea5b54be2d2f9cb','ufa5aca406f6abdbb393dc572469a975a','u87edbf0f175fe8cc555d625f7e47d148','u3b35ed7d2edb147bf94e557513018a39','u6337606cb720fbea1524bf067050ec10','ud2c77b5758cf7e1b382e77a52d7b7658','udbc9d6239524016b2d0752cdf43872ba'];
        return bot; 
    }

    isAdminOrBot(param) {
        return this.myBot.includes(param);
    }

    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                }
            }
        }
    }

    poll(operation) {
        if(operation.type == 25 || operation.type == 26) {
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === this.myBot[0]) ? operation.message.from : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            this.textMessage(message)
        }

        if(operation.type == 13 && this.stateStatus.cancel == 1) {
            this._cancel(operation.param2,operation.param1);
            
        }

        if(operation.type == 11 && !this.isAdminOrBot(operation.param2) && this.stateStatus.qrp == 1) {
            this._kickMember(operation.param1,[operation.param2]);
            this.messages.to = operation.param1;
            this.qrOpenClose();
        }

        if(operation.type == 19 && this.stateStatus.autokick == 1) { 
            //ada kick
            // op1 = group nya
            // op2 = yang 'nge' kick
            // op3 = yang 'di' kick
            if(!isAdminOrBot(operation.param2)) {
                this._kickMember(operation.param1,[operation.param2]);
                this._invite(operation.param1,[operation.param3]);              
            } 

        }
        if(operation.type == 55){ //ada reader
            const idx = this.checkReader.findIndex((v) => {
                if(v.group == operation.param1) {
                    return v
                }
            })
            if(this.checkReader.length < 1 || idx == -1) {
                this.checkReader.push({ group: operation.param1, users: [operation.param2], timeSeen: [operation.param3] });
            } else {
                for (var i = 0; i < this.checkReader.length; i++) {
                    if(this.checkReader[i].group == operation.param1) {
                        if(!this.checkReader[i].users.includes(operation.param2)) {
                            this.checkReader[i].users.push(operation.param2);
                            this.checkReader[i].timeSeen.push(operation.param3);
                        }
                    }
                }
            }
        }

        if(operation.type == 13) { // diinvite
            if(this.isAdminOrBot(operation.param2)) {
                return this._acceptGroupInvitation(operation.param1);
            } else {
                return this._cancel(operation.param1,this.myBot);
            }
        }
        this.getOprationType(operation);
    }

        if(txt == 'creator') {
         seq.contentType=13;
            seq.contentMetadata = { mid: 'u00f827ce6641038d7c9b6704a9777dfa' };
            this._client.sendMessage(1, seq);
        }
command(msg, reply) {
        if(this.messages.text !== null) {
            if(this.messages.text === msg.trim()) {
                if(typeof reply === 'function') {
                    reply();
                    return;
                }
                if(Array.isArray(reply)) {
                    reply.map((v) => {
                        this._sendMessage(this.messages, v);
                    })
                    return;
                }
                return this._sendMessage(this.messages, reply);
            }
        }
    }

    async textMessage(messages) {
        this.messages = messages;
        let payload = (this.messages.text !== null) ? this.messages.text.split(' ').splice(1).join(' ') : '' ;
        let receiver = messages.to;
        let sender = messages.from;
        
        this.command('Ryandika', ['Ryandika siap']);
        this.command('Oaja', this.getProfile.bind(this));
        this.command('status', `Your Status: ${JSON.stringify(this.stateStatus)}`);
        this.command(`left ${payload}`, this.leftGroupByName.bind(this));
        this.command('speed', this.getSpeed.bind(this));
        this.command('kernel', this.checkKernel.bind(this));
        this.command(`kick ${payload}`, this.OnOff.bind(this));
        this.command(`cancel ${payload}`, this.OnOff.bind(this));
        this.command(`qrp ${payload}`, this.OnOff.bind(this));
        this.command(`bkontol ${payload}`,this.kickAll.bind(this));
        this.command(`gajadisemuanya ${payload}`, this.cancelMember.bind(this));
        this.command(`setpoint`,this.setReader.bind(this));
        this.command(`sider`,this.rechecks.bind(this));
        this.command(`clearall`,this.clearall.bind(this));
        this.command('myid',`Your ID: ${messages.from}`)
        this.command(`ip ${payload}`,this.checkIP.bind(this))
        this.command(`ig ${payload}`,this.checkIG.bind(this))
        this.command(`qr ${payload}`,this.qrOpenClose.bind(this))
        this.command(`joinqr ${payload}`,this.joinQr.bind(this));
        this.command(`spam ${payload}`,this.spamGroup.bind(this));
        this.command(`creator`,this.creator.bind(this));

        this.command(`pap ${payload}`,this.searchLocalImage.bind(this));
        this.command(`upload ${payload}`,this.prepareUpload.bind(this));
        this.command(`vn ${payload}`,this.vn.bind(this));

        if(messages.contentType == 13) {
            messages.contentType = 0;
            if(!this.isAdminOrBot(messages.contentMetadata.mid)) {
                this._sendMessage(messages,messages.contentMetadata.mid);
            }
            return;
        }

        if(this.stateUpload.group == messages.to && [1,2,3].includes(messages.contentType)) {
            if(sender === this.stateUpload.sender) {
                this.doUpload(messages);
                return;
            } else {
                messages.contentType = 0;
                this._sendMessage(messages,'Wrong Sender !! Reseted');
            }
            this.resetStateUpload();
            return;
        }

        // if(cmd == 'lirik') {
        //     let lyrics = await this._searchLyrics(payload);
        //     this._sendMessage(seq,lyrics);
        // }

    }

}

module.exports = LINE;
