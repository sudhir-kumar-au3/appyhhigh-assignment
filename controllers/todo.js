const { Todo } = require("../dbConfig");
const moment = require("moment");
const addTodo = (req, res) => {
  let data = {
    channelId: req.body.channel_id,
    task: req.body.text,
    author: req.body.user_name,
  };
  let out;

  //adding task to todo
  if (req.body.command === "/addtask") {
    if (data.task !== "") {
      Todo.findOne({
        task: data.task,
      })
        .then((todoData) => {
          if (!todoData) {
            // out = {
            //   response_type: "in_channel",
            //   text: "Hello :smile:",
            //   attachments:[
            //     {
            //       text: `_${data.author}_\t added *${data.task}* in TODO`
            //     }
            //   ]
            // }
            // res.status(200).json(out);
            Todo.create(data)
              .then(data => {
                res.status(200).json({
                  response_type: "in_channel",
                  text: "Hello :smile:",
                  attachments: [
                    {
                      text: `${data.author}\t Added *${
                        data.task
                      }* into TODO \n> _${```${moment(
                        data.createdAt
                      ).format("h:mm a, MM Do YYYY")}```}_`,
                    },
                  ],
                })
              })
              .catch((error) => {
                res.status(500).json({ error: error.message });
              });
          } else {
            out = {
              attachments: [
                {
                  text: `A similar task already added in the list`,
                  color: "danger",
                },
              ],
            };
            res.status(200).json(out);
          }
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    } else {
      out = {
        attachments: [
          {
            text: `cannot add empty task`,
            color: "danger",
          },
        ],
      };
      res.status(200).json(out);
    }
  }

  // marking todo as done
  else if (req.body.command === "/marktask") {
    Todo.findOneAndDelete({
      task: req.body.text,
    })
      .then((response) => {
        if (response) {
          out = {
            response_type: "in_channel",
            attachments: [
              {
                text: `${response.task} marked as done by _${response.author}_`,
                color: "green",
              },
            ],
          };
          res.status(200).json(out);
        } else {
          out = {
            attachments: [
              {
                text: `No such task exists`,
                color: "danger",
              },
            ],
          };
          res.status(200).json(out);
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }

  // showing todo list
  else if (req.body.command === "/listtask") {
    Todo.find({
      channelId: req.body.channel_id,
    })
      .then((response) => {
        if (response.length > 0) {
          out = {
            response_type: "in_channel",
            attachments: [
              {
                text: `${response
                  .map((data, index) => `${index + 1}. ${data.task}>${data.author}>_${data.createdAt}_\n`)
                  .join("")}`,
              },
            ],
          };
          res.status(200).json(out);
        } else {
          out = {
            response_type: "in_channel",
            attachments: [
              {
                text: "Nothing in TODO",
                color: "danger",
              },
            ],
          };
          res.status(200).json(out);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
};
module.exports = {
  addTodo,
};
