require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const {
	getDistrictData,
	getSessionData,
	getStateData,
} = require("./controllers/getData");

bot.start((ctx) => {
	ctx.reply(`Welcome ${ctx.message.from.first_name}. Type /help to start.`);
});

bot.help(async (ctx) => {
	ctx.telegram.sendMessage(ctx.chat.id, "Help is on way..!! Please Wait.");
	try {
		temp_data = await getStateData(ctx);
		ctx.telegram.sendMessage(ctx.chat.id, "Select your State", {
			reply_markup: {
				inline_keyboard: temp_data,
			},
		});
	} catch (error) {
		console.log(error);
	}
});

bot.action("go-back", async (ctx) => {
	ctx.deleteMessage();
	temp_data = await getStateData(ctx);
	ctx.telegram.sendMessage(ctx.chat.id, "Select your State", {
		reply_markup: {
			inline_keyboard: temp_data,
		},
	});
});

bot.on("callback_query", async (ctx) => {
	ctx.deleteMessage();
	const chat_id = ctx.update.callback_query.message.chat.id;
	let d = new Date();
	date = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
	ctx.reply("Getting Data. please wait");
	let query = ctx.update.callback_query.data;
	if (query.endsWith("s")) {
		query = query.slice(0, query.length - 1);
		temp_data = await getDistrictData(query);
		ctx.telegram.sendMessage(ctx.chat.id, "Select your District", {
			reply_markup: {
				inline_keyboard: temp_data,
			},
		});
	} else {
		temp_data = await getSessionData(query, date);
		if (!temp_data) {
			ctx.reply("Opps! No data found. Try again later");
			return;
		}
		temp_data.map((session) => {
			const response = `<b>Name:</b> ${session.name}.
			<b>Address:</b>${session.address || "N.A."}.
			<b>Time:</b> ${session.from} - ${session.to}
			<b>Fee:</b> ${session.fee_type}  ${session.fee}
			<b>Date:</b> ${session.date}.
			<b>Vaccine:</b> ${session.vaccine}.
			<b>Dose 1:</b> ${session.available_capacity_dose1}.
			<b>Dose 2:</b> ${session.available_capacity_dose2}.
			<b>Capacity:</b> ${session.available_capacity}.
			<b>Minimum Age:</b> ${session.min_age_limit}.
			<b>Slots:</b> ${session.slots.map((slot) => slot)}.
			<b>Block:</b> ${session.block_name}.
			<b>District:</b> ${session.district_name}.
			<b>State:</b> ${session.state_name}.
			<b>Pincode:</b> ${session.pincode}.
			${
				ctx.update.callback_query.message.chat.first_name
			} Want to search more?. Type <b>/help</b> to start.
			`;
			ctx.telegram.sendMessage(chat_id, response, { parse_mode: "HTML" });
		});
	}
});

bot.launch(); // start

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//
