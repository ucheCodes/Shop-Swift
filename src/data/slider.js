function showSlide(){
    var i;
    var index = 0;
    this.automate = function automate(classname) {
        var slides = document.getElementsByClassName(classname);
        if (slides.length) {
            var loopSlides = this;
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";                      
            }
            index++;
            if (index > slides.length) {
                index = 1
            }
            slides[index-1].style.display = "block";
            setTimeout(
                function () {
                    loopSlides.automate(classname);
                },5000
            );
            // console.log(this.storyIndex);
        //     if (slides.id.includes('.jpg') || slides.value.includes('.jpeg')) {
        //         setTimeout(
        //             function () {
        //                 loopSlides.automate(classname);
        //             },5000
        //         );
        //     }
        //     else if (slides.id.includes('.mp4') || slides.value.includes('.3gp'))
        //     {
        //         alert("set video time to 1 minute")
        //     }
        //     else{
        //         alert(slides.id)
        //     }
         }
    }
}

export {showSlide}