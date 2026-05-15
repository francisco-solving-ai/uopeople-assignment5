const { User, ShowMeInformation } = require("../models");

async function seedDatabase() {
  const userCount = await User.count();

  if (userCount > 0) {
    return;
  }

  const users = await User.bulkCreate(
    [
      {
        firstName: "Francisco",
        lastName: "Pautt",
        email: "francisco@example.com",
        role: "admin",
      },
      {
        firstName: "Alicia",
        lastName: "Mendez",
        email: "alicia@example.com",
        role: "editor",
      },
    ],
    { returning: true }
  );

  await ShowMeInformation.bulkCreate([
    {
      name: "Repository Overview",
      about: "ShowMe stores repository-related data that can be retrieved by the backend API.",
      language: "English",
      documentation: "Backend API overview for repository entities and related data.",
      userId: users[0].id,
    },
    {
      name: "User Guidance",
      about: "This record represents documentation and support information attached to a user.",
      language: "English",
      documentation: "User-focused guidance and support material linked to application records.",
      userId: users[1].id,
    },
  ]);
}

module.exports = {
  seedDatabase,
};
