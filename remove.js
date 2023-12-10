const dotenv = require("dotenv");
const { Client } = require("@notionhq/client");
const chalk = require("chalk");

dotenv.config();

const { NOTION_API_KEY, DATABASEID } = process.env;

const notion = new Client({ auth: NOTION_API_KEY });

// GLOBAL PROPS.
const nameProp = "Teacher Guide Name";
const searchKeys = ["G3S1", "G1S1", "G2S2", "G3S1", "G11S2"];

const affectedPages = [];
const nonAffectedPages = [];

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
    return response;
  } catch (error) {
    console.error(chalk.red(error));
  }
}

async function remove(blockId) {
  try {
    const response = await notion.blocks.delete({
      block_id: blockId,
    });
    // console.log(response);
  } catch (error) {
    console.error(chalk.red("Error appending blocks:", error));
  }
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function main() {
  try {
    console.log(chalk.yellow.bold("Going through the keys...."));

    // loop through searchKeys
    for (const searchKey of searchKeys) {
      console.log(chalk.yellow.bold("-Looking for pages in ", searchKey));

      const resPages = await retrievePages(searchKey);
      if (resPages.length) {
        //If pages are there.
        console.log(chalk.yellow(" Going through pages..."));
        for (const page of resPages) {
          let response = await childrenList(page.id);
          const pageName = page.properties[nameProp].title[0].plain_text;
          response = response.results;
          if (response.length !== 0) {
            const toggleAvail = response.filter(
              //To check if the block you want to add already there.
              (obj) =>
                obj.heading_3 &&
                obj.heading_3.is_toggleable &&
                obj.heading_3.rich_text[0].plain_text ==
                  "Publishing the project with the student"
            );
            if (toggleAvail.length !== 0) {
              for (const [index, block] of response.entries()) {
                if (block.type == "heading_1") {
                  const blockContent = block.heading_1.rich_text[0].plain_text;
                  if (blockContent == "Glossaries") {
                    await remove(response[index - 1].id);
                    affectedPages.push(pageName);
                  }
                }
                sleep(300);
              }
            } else {
              console.log(chalk.yellow("  The block Not there ", pageName));
              nonAffectedPages.push(pageName);
            }
          } else {
            console.log(chalk.yellow("  No blocks found in ", pageName));
            nonAffectedPages.push(pageName);
          }
        }
      } else {
        console.log(
          chalk.yellow("  No pages found with the filter", searchKey)
        );
      }
      console.log(chalk.green(searchKey, " Done!"));
      console.log(chalk.green("Total pages : " + resPages.length));
      console.log(chalk.green("Affected Pages: " + affectedPages.join("  ")));
      console.log(
        chalk.green("Non Affected Pages: " + nonAffectedPages.join("  "))
      );
      console.log(
        "-----------------------------------------------------------------------------"
      );
      sleep(500);
      affectedPages.length = 0;
      nonAffectedPages.length = 0;
    }
  } catch (error) {
    console.error(chalk.red("Error Main function:", error));
  }
}

main();
