const config = require("../../config");
const { DataTypes } = require("sequelize");

const JobDB = config.DATABASE.define("schedules", {
  chat: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

exports.setSchedule = async (chatId, time, scheduleType, groupName, message, enabled) => {
  const existingSchedules = await JobDB.findAll({
    where: { chat: chatId }
  });

  const scheduleTemplate = {
    mute: { time: '', groupName: '', enabled: false, message: '' },
    unmute: { time: '', groupName: '', enabled: false, message: '' }
  };

  if (existingSchedules.length < 1) {
    if (!time) return false;

    const newSchedule = { ...scheduleTemplate };
    newSchedule[scheduleType] = { time, groupName, enabled: enabled ?? false, message: message ?? "null" };

    await JobDB.create({
      chat: chatId,
      content: JSON.stringify(newSchedule)
    });

    return true;
  } else {
    const existingSchedule = JSON.parse(existingSchedules[0].content);
    existingSchedule[scheduleType] = {
      time: time ?? existingSchedule[scheduleType].time,
      groupName: groupName ?? existingSchedule[scheduleType].groupName,
      enabled: enabled ?? existingSchedule[scheduleType].enabled,
      message: message ?? existingSchedule[scheduleType].message ?? "null"
    };

    await existingSchedules[0].update({
      chat: chatId,
      content: JSON.stringify(existingSchedule)
    });

    return true;
  }
};

exports.getSchedule = async (chatId, scheduleType) => {
  const schedules = await JobDB.findAll({
    where: { chat: chatId }
  });

  if (schedules.length < 1) return false;

  return JSON.parse(schedules[0].content)[scheduleType];
};

exports.getAllSchedule = async () => await JobDB.findAll();

