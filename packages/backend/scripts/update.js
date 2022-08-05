const fs = require("fs");

fs.readFile("./generated/index.ts", "utf8", function (_, data) {
  data = data.replace(
    /^.*(UploadFile|UploadFolder|Users_Permissions|UsersPermissions)+.*$/gm,
    ""
  );

  fs.writeFile("./generated/index.ts", data, function (_) {
    console.log("update completed");
  });
});
