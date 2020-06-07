AFRAME.registerComponent('markerhandler', {

    init: function() {
        const animatedMarker = document.querySelector("#animated-marker");
        const aEntity = document.querySelector("#animated-model1");
        const aEntity2 = document.querySelector("#animated-model2");
        const aEntity3 = document.querySelector("#animated-model3");
        const aEntity4 = document.querySelector("#animated-model4");
        const aEntity5 = document.querySelector("#animated-model5");
        const contact1 = document.querySelector("#contact1");
        const contact2 = document.querySelector("#contact2");
        const contact3 = document.querySelector("#contact3");
        const contact4 = document.querySelector("#contact4");
        const contact5 = document.querySelector("#contact5");

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
