// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    bsCustomFileInput.init();

    // document.querySelector('.custom-file-input').addEventListener('change', function (e) {
    // var fileName = document.getElementById("testInput").files[0].name;
    // var fileName2 = document.getElementById("testInput").files[1].name;
    // document.getElementById("testId").innerText = "test111" + fileName;
    // var nextSibling = e.target.nextElementSibling
    // nextSibling.innerText = fileName + "test"
    // })

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })

})()