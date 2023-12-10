const dotenv = require("dotenv");
const { Client } = require("@notionhq/client");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

dotenv.config();

const { NOTION_API_KEY, DATABASEID } = process.env;

const notion = new Client({ auth: NOTION_API_KEY });

// GLOBAL PROPS.
const nameProp = "Teacher Guide Name";
const searchKeys = [];

let nsChildren = 0;

const final = {
  zeroTime: {},
  missingChildren: {},
  moreThanOneTime: {},
};
const blockNotThere = [];
const moreThanOnce = [];
const blockNotFull = [];
const blockFull = [];
const noBlocksAtAll = [];

async function retrievePages(searchKey) {
  try {
    const response = await notion.databases.query({
      database_id: DATABASEID,
      filter: {
        property: nameProp,
        rich_text: {
          contains: searchKey,
        },
      },
    });
    return response.results;
  } catch (error) {
    console.error(chalk.red(error));
  }
}

async function childrenList(id) {
  try {
    const response = await notion.blocks.children.list({
      block_id: id,
    });
    return response.results;
  } catch (error) {
    console.error(chalk.red(error));
  }
}

async function getAllChildren(id) {
  try {
    const response = await childrenList(id);

    for (const el of response) {
      if (el.paragraph) {
        const textContent = el.paragraph.rich_text[0].text.content;
        if (
          textContent ===
            "Please note that it is important to publish the project with the student in the iSchool System!" ||
          textContent ===
            "Students can log in to their dashboard easily with the username and password given to them." ||
          textContent ===
            "From your Dashboard, you will find multiple tabs, select the Projects tab and it will transfer you to your projects" ||
          textContent === "" ||
          textContent ===
            "In this tab, you will find your projects, and if you have not uploaded any projects before, you can choose to add a project and add your first one." ||
          textContent ===
            "To add any projects you will need to fill in the following :" ||
          textContent ===
            "You can review all your uploaded projects from this tab, as it works like a project gallery, also you can edit any old projects if you have new updates on them, click on the edit icon in the left corner of the project." ||
          textContent ===
            "After you click on edit you can edit any field you need, or if you want to delete the project and upload a new one you can do so."
        ) {
          nsChildren++;
          if (el.has_children) {
            sleep(300);
            await getAllChildren(el.id);
          }
        }
      }
      if (el.heading_3 && el.heading_3.is_toggleable) {
        const textContent = el.heading_3.rich_text[0].text.content;
        if (textContent === "Steps for the students") {
          nsChildren++;
          if (el.has_children) {
            sleep(300);
            await getAllChildren(el.id);
          }
        }
      }
      if (el.numbered_list_item) {
        const textContent = el.numbered_list_item.rich_text[0].text.content;
        if (
          textContent === "Log in to the Dashboard" ||
          textContent === "Choose Projects" ||
          textContent === "Add new Project" ||
          textContent === "Fill the needed data" ||
          textContent ===
            "Category: you will need to choose your current Category/course/ level from the list" ||
          textContent === "Project title: Your project’s title/name" ||
          textContent ===
            "Description: Here you can add what is your project, what it can do, how you built it, and all the details you want to add" ||
          textContent ===
            "Project URL: Here you can add your project’s link/URL, like the link on mBlock, or any online platform, Google Drive or OneDrive link" ||
          textContent ===
            "Cover image: Here you can take a screenshot from the project or you can upload any image that represents the project" ||
          textContent ===
            "After you finish all this you can click on submit to save the project" ||
          textContent === "Review Your Project" ||
          textContent === "Edit or delete the project"
        ) {
          nsChildren++;
          if (el.has_children) {
            sleep(300);
            await getAllChildren(el.id);
          }
        }
      }
      if (el.image) {
        const url = el.image.external.url;
        if (
          url === "https://i.ibb.co/qyGwVHG/1png.png" ||
          url === "https://i.ibb.co/gFv79cN/2.png" ||
          url === "https://i.ibb.co/kHdSs0v/3.png" ||
          url === "https://i.ibb.co/6P5X2dL/4.png" ||
          url === "https://i.ibb.co/ZTTfwRV/5.png" ||
          url === "https://i.ibb.co/WBxpccL/6.png" ||
          url === "https://i.ibb.co/z6scQBM/7.png"
        ) {
          nsChildren++;
          if (el.has_children) {
            sleep(300);
            await getAllChildren(el.id);
          }
        }
      }
    }
  } catch (error) {
    console.error(chalk.red("Error getting all children function:", error));
  }
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function main() {
  try {
    console.log(chalk.yellow.bold("Searching...."));

    // loop through searchKeys
    for (const searchKey of searchKeys) {
      console.log(chalk.yellow.bold("-Looking for pages in ", searchKey));

      const resPages = await retrievePages(searchKey);
      const resPagesLength = resPages.length;
      if (resPagesLength) {
        //If pages are there.
        console.log(chalk.yellow(" Going through pages..."));
        for (const page of resPages) {
          let response = await childrenList(page.id);
          const pageName = page.properties[nameProp].title[0].plain_text;
          if (response.length !== 0) {
            const toggleAvail = response.filter(
              //To check if the block you want to add already there.
              (obj) =>
                obj.heading_3 &&
                obj.heading_3.is_toggleable &&
                obj.heading_3.rich_text[0].plain_text ==
                  "Publishing the project with the student"
            );

            const keyName = pageName.slice(pageName.lastIndexOf("-") + 1);
            if (toggleAvail.length == 0) {
              if (!final["zeroTime"].hasOwnProperty([keyName])) {
                final["zeroTime"] = { ...final["zeroTime"], [keyName]: [] };
              }
              final["zeroTime"][keyName].push(
                pageName.slice(
                  pageName.indexOf("-") + 1,
                  pageName.lastIndexOf("-")
                )
              );
              blockNotThere.push(pageName);
            } else if (toggleAvail.length < 2) {
              nsChildren++;
              const el = toggleAvail[0];
              if (el.has_children) {
                await getAllChildren(el.id);
                if (nsChildren !== 30) {
                  if (!final["missingChildren"].hasOwnProperty([keyName])) {
                    final["missingChildren"] = {
                      ...final["missingChildren"],
                      [keyName]: [],
                    };
                  }
                  final["missingChildren"][keyName].push(
                    pageName.slice(
                      pageName.indexOf("-") + 1,
                      pageName.lastIndexOf("-")
                    )
                  );
                  blockNotFull.push(pageName);
                } else {
                  blockFull.push(pageName);
                }
                nsChildren = 0;
              } else {
                blockFull.push(pageName);
              }
            } else {
              if (!final["moreThanOneTime"].hasOwnProperty([keyName])) {
                final["moreThanOneTime"] = {
                  ...final["zeroTime"],
                  [keyName]: [],
                };
              }
              final["moreThanOneTime"][keyName].push(
                pageName.slice(
                  pageName.indexOf("-") + 1,
                  pageName.lastIndexOf("-")
                )
              );
              moreThanOnce.push(pageName);
            }
          } else {
            console.log(chalk.yellow("   No blocks found in ", pageName));
            noBlocksAtAll.push(pageName);
          }
        }
      } else {
        console.log(
          chalk.yellow("  No pages found with the filter", searchKey)
        );
      }
      if (resPagesLength !== 0) {
        console.log(chalk.green(searchKey, chalk.green.bold(" Done!")));

        console.log(
          chalk.green(chalk.green.bold("Total pages : ") + resPagesLength)
        );
        console.log(
          chalk.green(
            "Block ",
            chalk.green.bold("NOT there"),
            " pages:         " + blockNotThere.join("  ")
          )
        );
        console.log(
          chalk.green(
            "Block ",
            chalk.green.bold("UNFILLED"),
            " pages:         " + blockNotFull.join("  ")
          )
        );
        console.log(
          chalk.green(
            "Block ",
            chalk.green.bold("MORE THAN ONCE"),
            " pages:         " + moreThanOnce.join("  ")
          )
        );
        console.log(
          chalk.green(
            "Block ",
            chalk.green.bold("COMPLETE"),
            " pages:         " + blockFull.join("  ")
          )
        );
        console.log(
          chalk.green(
            chalk.green.bold("EMPTY"),
            " pages:         " + noBlocksAtAll.join("  ")
          )
        );
      }
      console.log(
        "-----------------------------------------------------------------------------"
      );
      sleep(300);
      blockNotThere.length = 0;
      blockNotFull.length = 0;
      moreThanOnce.length = 0;
    }

    // Write the result to file.
    const outputFile = path.join(__dirname, "output.json");
    fs.writeFileSync(outputFile, JSON.stringify(final, null, 2));

    console.log(
      chalk.yellow.bold(
        "DONE!....Check the ",
        chalk.yellow.italic("output.json"),
        " file"
      )
    );
  } catch (error) {
    console.error(chalk.red("Error Main function:", error));
  }
}

main();
