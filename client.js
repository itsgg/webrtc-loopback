if (Modernizr.getusermedia) {
    var yourVideo = document.querySelector('#yours');
    var theirVideo = document.querySelector('#theirs');

    navigator.getUserMedia = navigator.getUserMedia || navigator.webKitGetUserMedia ||
                             navigator.mozGetUserMedia || navigator.msGetUserMedia;

    navigator.getUserMedia({ video: true, audio: false }, function (stream) {
        yourVideo.src = window.URL.createObjectURL(stream);

        if (Modernizr.peerconnection) {
            startPeerConnection(stream);
        } else {
            console.log('No peer connection support');
        }

    }, function (error) {
        console.log(error);
    });

} else {
    console.log('No user media support');
}

function startPeerConnection(stream) {
    var configuration = {
        // 'iceServers': [{ 'url': 'stun:stun.1.google.com:19302'}]
    };
    console.log(stream);
    console.log("\n");
    console.log("\n");


    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection ||
                               window.mozRTCPeerConnection;

    var yourConnection = new RTCPeerConnection(configuration);
    var theirConnection = new RTCPeerConnection(configuration);
    console.log('yourConnection: ');
    console.log(yourConnection);
    console.log("\n");
    console.log("\n");

    console.log('theirConnection: ');
    console.log(theirConnection);
    console.log("\n");
    console.log("\n");

    yourConnection.addStream(stream);
    theirConnection.onaddstream = function(e) {
        console.log('onaddstream: ')
        console.log(e);
        console.log("\n");
        console.log("\n");

        theirVideo.src = window.URL.createObjectURL(e.stream);
    };

    yourConnection.onicecandidate = function (event) {
        console.log('your onicecandidate: ');
        console.log(event);
        console.log("\n");
        console.log("\n");

        if (event.candidate) {
            theirConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    };

    theirConnection.onicecandidate = function (event) {
        console.log('their onicecandidate:');
        console.log(event);
        console.log("\n");
        console.log("\n");

        if (event.candidate) {
            yourConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }

    yourConnection.createOffer(function (offer) {
        console.log('your offer: ');
        console.log(offer);
        console.log("\n");
        console.log("\n");

        yourConnection.setLocalDescription(offer);
        theirConnection.setRemoteDescription(offer);

        theirConnection.createAnswer(function (offer) {
            console.log('their offer: ');
            console.log(offer);
            console.log("\n");
            console.log("\n");


            theirConnection.setLocalDescription(offer);
            yourConnection.setRemoteDescription(offer);
        }, function (error) {
            consol.log(error);
        });
    }, function (error) {
        console.log(error);
    });
}
