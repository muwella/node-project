export const get_private_key = () => {
    const private_key = process.env.PRIVATE_KEY
    if (!private_key) { throw new Error('PRIVATE_KEY NOT FOUND') }
    return private_key
}