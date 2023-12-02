const { Client } = require("@notionhq/client");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Notion client with your API token
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const newBlocks = [
  {
    has_children: true,
    heading_3: {
      rich_text: [
        {
          text: {
            content: "Publishing the project with the student ",
          },
          plain_text: "Publishing the project with the student ",
        },
      ],
      is_toggleable: true,
      color: "yellow_background",
    },
    children: [
      {
        has_children: false,
        paragraph: {
          rich_text: [
            {
              text: {
                content:
                  "Please note that it is important to publish the project with the student in the iSchool System!",
              },

              plain_text:
                "Please note that it is important to publish the project with the student in the iSchool System!",
            },
          ],
        },
      },
      //   {
      //     has_children: true,
      //     heading_3: {
      //       rich_text: [
      //         {
      //           text: {
      //             content: "Steps for the students",
      //           },
      //           plain_text: "Steps for the students",
      //         },
      //       ],
      //       is_toggleable: true,
      //     },
      //     children: [
      //       {
      //         has_children: true,
      //         numbered_list_item: {
      //           rich_text: [
      //             {
      //               text: {
      //                 content: "Log in to the Dashboard ",
      //               },
      //               plain_text: "Log in to the Dashboard ",
      //             },
      //           ],
      //         },
      //         children: [
      //           {
      //             has_children: false,

      //             paragraph: {
      //               rich_text: [
      //                 {
      //                   text: {
      //                     content:
      //                       "Students can log in to their dashboard easily with the username and password given to them.",
      //                   },
      //                   plain_text:
      //                     "Students can log in to their dashboard easily with the username and password given to them.",
      //                 },
      //               ],
      //             },
      //           },
      //           {
      //             has_children: false,
      //             image: {
      //               external: {
      //                 url: "https://i.ibb.co/VgDCz6Q/image.png",
      //               },
      //             },
      //           },
      //         ],
      //       },
      //     ],
      //   },
    ],
  },
];

function lastObjCloneExcluder(obj, excluder) {
  let { [excluder]: _, ["has_children"]: __, ...rest } = obj;
  //   const keys = Object.keys(obj);
  //   console.log(obj);
  //   const lastKey = keys.length > 0 ? keys[keys.length - 1] : null;
  return { rest, _ };
}

async function appendIfChildren(id, blockId, blocks) {
  try {
    const response = await notion.blocks.children.append({
      block_id: id,
      after: blockId,
      children: blocks,
    });
    console.log(response.results);
  } catch (error) {
    console.error("Error fetching children blocks:", error);
  }
}

// newBlocks.forEach((el) => {
//   if (el.has_children) {
//     const { rest, _ } = lastObjCloneExcluder(el, "children");
//     console.log(rest);
//     console.log(_);
//   }
// });

appendIfChildren("613578414f7d47c998a1f00ada603c57", undefined, [
  {
    paragraph: {
      rich_text: [
        {
          text: {
            content: "Sam",
          },
        },
      ],
    },
  },
]);
