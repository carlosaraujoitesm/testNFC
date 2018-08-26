/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


            


var app = {

    id : "",
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        console.log("Starting NFC Reader app");
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function(){

            //Listen to Tag RFID
            nfc.addTagDiscoveredListener(
                app.onNonNdef,  //Tag successfully scanned
                function(status){
                },
                function(error){
                    app.display("NFC reader failed to initialize " + JSON.stringify(error));
                }
            );
            
            //Listen to NDEF tags
            nfc.addNdefListener(
                app.onNfc,
                // Tag successfully scanned
                function (status) {
                // Listener successfully initialized
                },
                function (error) {
                // Listener fails to initialize
                app.display("NFC reader failed to initialize " + JSON.stringify(error));
                }
            );
    },

    /*
    Process NDEF tag data from the nfcEvent
    */
    onNfc: function(nfcEvent) {

        if(app.id != ""){
            //Si el articulo no se encuentra en la lista del usuario, asumir solicitar
            app.show(document.getElementById('solicitar'));
            app.showTag(nfcEvent.tag,'infoNFCS');
            //Si ya se encuentra en la lista del usuario, asumir devolver
            app.show(document.getElementById('devolver'));
            app.showTag(nfcEvent.tag,'infoNFCD');

            //Si
        }else{
            app.hide(document.getElementById('solicitar'));
            app.hide(document.getElementById('devolver'));
            app.hide(document.getElementById('home'));
            app.hide(document.getElementById('userInfo'));
            app.show(document.getElementById('deviceInfo'));
            app.showTag(nfcEvent.tag,'componentsInfo');

        }
    },
    /*
    Process non-NDEF tag data from the nfcEvent
    This includes
    * Non NDEF NFC Tags
    * NDEF-Formatable Tags
    * Mifare Classic Tags on Nexus 4, Samsung S4
    (because Broadcom doesn't support Mifare Classic)
    */

    onNonNdef: function(nfcEvent) {
        var tag = nfcEvent.tag;
        app.id = nfc.bytesToHexString(tag.id); 
        app.show(document.getElementById('userinfo'));
        app.hide(document.getElementById('home'));
        app.display(app.id,'taguserid');
    },

    showTag: function(tag,div) {
        // display the tag properties:

        var thisMessage = tag.ndefMessage;
        if (thisMessage !== null) {
            // get and display the NDEF record count:
            //app.display("Tag has NDEF message with " + thisMessage.length + " record" + (thisMessage.length === 1 ? ".":"s."),'infoNFC');
            //app.display("Message Contents: ",'infoNFC');
            app.showMessage(thisMessage,div);
        }
    },

    /*
    iterates over the records in an NDEF message to display them:
    */
    showMessage: function(message,div) {
        for (var thisRecord in message) {
        // get the next record in the message array:
        var record = message[thisRecord];
        app.showRecord(record,div);
        // show it
        }
    },
    /*
    writes @record to the message div:
    */
    showRecord: function(record,div) {
        app.display(nfc.bytesToString(record.payload).substring(3),div);    
    },

    display: function(message, div){
        
        var label = document.createTextNode(message),
        linebreak = document.createElement("br");
        var elem = document.getElementById(div);
        elem.appendChild(linebreak);
        elem.appendChild(label);
    },

    clear: function(div){
        elem = document.getElementById(div);
        elem.innerHTML = "";
    },

    show : function (elem) {
        elem.classList.add('is-visible');
    },
    
    // Hide an element
    hide : function (elem) {
        elem.classList.remove('is-visible');
    },

    userInfo: function(message){

        //Traer datos de API de Sandra para datos de usuario, ordenes activas
        app.clear('userInfDiv');
        app.id =  message;
        app.display(message, 'userInfDiv');
        //Start reading things
        app.initialize();
    }
};

