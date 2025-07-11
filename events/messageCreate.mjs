// events/messageCreate.mjs
export default async function ({ log, msg, db }, message) {
    log.debug('messageCreate', { id: message.id });
    if (message.author.bot) return;
    if (!message.guild || message.channel.type !== 0) return;
    const num = parseInt(message.content.trim(), 10);
    if (isNaN(num)) return;
    const locale = message.guild?.preferredLocale || 'en-US';
    const [rows] = await db.query(
        'SELECT * FROM counting_state WHERE channel_id = ?',
        [message.channel.id]
    );
    let state = rows[0];
    if (!state) {
        await db.query(
            'INSERT INTO counting_state (channel_id, current_count, last_user_id, last_message_id) VALUES (?, 0, NULL, NULL)',
            [message.channel.id]
        );
        state = { channel_id: message.channel.id, current_count: 0, last_user_id: null, last_message_id: null };
    }
    if (state.last_user_id === message.author.id) {
        await db.query(
            'UPDATE counting_state SET current_count = 0, last_user_id = ?, last_message_id = ? WHERE channel_id = ?',
            [message.author.id, message.id, message.channel.id]
        );
        await message.reply(msg(locale, 'count_twice_error'));
        return;
    }
    if (num !== state.current_count + 1) {
        await db.query(
            'UPDATE counting_state SET current_count = 0, last_user_id = ?, last_message_id = ? WHERE channel_id = ?',
            [message.author.id, message.id, message.channel.id]
        );
        await message.reply(msg(locale, 'wrong_number_error'));
        return;
    }
    await db.query(
        'UPDATE counting_state SET current_count = ?, last_user_id = ?, last_message_id = ?, updated_at = CURRENT_TIMESTAMP WHERE channel_id = ?',
        [num, message.author.id, message.id, message.channel.id]
    );
    if (num % 10 === 0) {
        await message.reply(msg(locale, 'success_message').replace('{num}', num));
    }
}