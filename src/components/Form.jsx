export function Form() {
    return (
        <form action="/mail.php" method="post">
            <label for="name">First Name:</label>
            <input type="text" id="name" name="name" required />
            <br />

            <label for="email">Email Address:</label>
            <input type="email" id="email" name="email" required />
            <br />

            <label for="message">Message:</label>
            <textarea id="message" name="message" required></textarea>
            <br />

            <input type="submit" value="Send"></input>
        </form>
    );
}
