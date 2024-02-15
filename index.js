const config = require('./config.json');
const { Client, GatewayIntentBits } = require('discord.js');
const { ethers, JsonRpcProvider } = require('ethers');
const { createGoogleCalendarEvent } = require('./calendar'); // Adjust the path as necessary

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const provider = new JsonRpcProvider(config.rpc);
client.login(config.token);

client.on('ready', async () => {
    console.log('bot started');
});

client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;
    console.log(`Message from ${msg.author.username}: ${msg.content}`);
    const content = msg.content

    if (content.startsWith('!createevent')) {
        const eventDetails = content.substring('!createevent '.length).split(';').map(s => s.trim());
        if (eventDetails.length < 6) {
            msg.channel.send('Invalid event details. Please provide summary, location, description, startDateTime, endDateTime, and timeZone.');
            console.log(eventDetails);
            return;
        }

 

        const [summary, location, description, startDateTime, endDateTime, timeZone] = eventDetails;
        const event = {
            'summary': summary,
            'location': location,
            'description': description,
            'start': { 'dateTime': startDateTime, 'timeZone': timeZone },
            'end': { 'dateTime': endDateTime, 'timeZone': timeZone },
        };

        try {
            const eventData = await createGoogleCalendarEvent(event);
            msg.channel.send(`Event created: ${eventData.htmlLink}`);
        } catch (error) {
            console.error('Error creating event:', error);
            msg.channel.send('Failed to create event.');
        }
    }
});
