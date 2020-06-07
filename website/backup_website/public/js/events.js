AFRAME.registerComponent('markerhandler', {

    init: function() {
        const animatedMarker = document.querySelector("#animated-marker");
        const aEntity = document.querySelector("#animated-model");

        // every click, we make our model grow in size :)
        animatedMarker.addEventListener('click', function(ev, target){
            const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
            var a = ev.srcElement.id.split("animated-marker");
            if (a.length != 2){
                var temp = a[0];
                const entity = document.querySelector('#'+temp);
                const url = entity.getAttribute('url');
                window.open(url);
            }
        });
}});
