(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })

    // Scroll Reveal Animation for Cards
    document.addEventListener("DOMContentLoaded", () => {
        const cards = document.querySelectorAll(".card");
        if (cards.length > 0) {
            const observerOptions = {
                root: null,
                rootMargin: "0px 0px -40px 0px",
                threshold: 0.05
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal");
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            cards.forEach((card) => {
                observer.observe(card);
            });
        }
    });
  })()