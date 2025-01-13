//   EmailJS Integration

(function () {
    emailjs.init("dANBulEYT6q93M-p4"); // Replace with your EmailJS user ID
})();

const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#email");
    const message = document.querySelector("#message");

    if (!email.value || !message.value) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!/\S+@\S+\.\S+/.test(email.value)) {
        alert("Please enter a valid email address.");
        return;
    }

    emailjs
        .sendForm("service_7pidedw", "template_ulnri3s", form)
        .then(
            () => {
                alert("Message sent successfully!");
                form.reset();
            },
            (error) => {
                alert("Failed to send message. Please try again later.");
            }
        );
});

