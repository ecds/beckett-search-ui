import { useRef } from "react";

export function Form() {
    const nameRef = useRef();
    const emailRef = useRef();
    const messageRef = useRef();
    const sendMail = async () => {
        await fetch("/mail.php", {
            method: "POST",
            body: `name=${encodeURI(nameRef.current.value)}&email=${encodeURI(
                emailRef.current.value,
            )}&message=${encodeURI(messageRef.current.value)}`,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
        });
    };

    const handleSubmit = () => {
        sendMail();
        return false;
    };
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">First Name:</label>
            <input ref={nameRef} type="text" id="name" name="name" required />
            <br />

            <label htmlFor="email">Email Address:</label>
            <input
                ref={emailRef}
                type="email"
                id="email"
                name="email"
                required
            />
            <br />

            <label htmlFor="message">Message:</label>
            <textarea ref={messageRef} id="message" name="message" required />
            <br />

            <input type="submit" value="Send"></input>
        </form>
    );
}
