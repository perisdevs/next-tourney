export default function Form() {
    return(
        <form action='/api/test' method='post'>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' name='name' required />
            <button type='submit'>Submit</button>
        </form>
    );
}