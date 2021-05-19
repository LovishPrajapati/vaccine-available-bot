let temp_data = [];
const axios = require("axios");

const getStateData = async (ctx) => {
	try {
		const { data } = await axios.get(
			"https://cdn-api.co-vin.in/api/v2/admin/location/states",
			{
				headers: {
					"User-Agent":
						"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
				},
			}
		);
		temp_data = data.states.map((state, index) => [
			{
				text: `${index + 1} ${state.state_name}`,
				callback_data: `${state.state_id}s`,
			},
		]);
		return temp_data;
	} catch (error) {
		console.log(error);
	}
};

const getDistrictData = async (query) => {
	try {
		const { data } = await axios.get(
			`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${query}`,
			{
				headers: {
					"User-Agent":
						"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
				},
			}
		);
		temp_data = data.districts.map((district, index) => [
			{
				text: `${index + 1} ${district.district_name}`,
				callback_data: `${district.district_id}`,
			},
		]);
		temp_data = [...temp_data, [{ text: "Go Back", callback_data: "go-back" }]];
		return temp_data;
	} catch (error) {
		console.log(error);
	}
};

const getSessionData = async (query, date) => {
	try {
		const { data } = await axios.get(
			`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${query}&date=${date}`,
			{
				headers: {
					"User-Agent":
						"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
				},
			}
		);

		return data.sessions;
	} catch (error) {
		console.log(error);
	}
};

module.exports = { getDistrictData, getSessionData, getStateData };
