/*
  todo.js -- Router for the ToDoList
*/
const express = require('express');
// const { render } = require('../app');
const router = express.Router();
const Transaction_i = require('../models/transactionItem')
const User = require('../models/User')


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/
// router.get('/transaction', (req, res) => {
//   res.render('transactionlist');
// })

isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}



// // get the value associated to the key
router.get('/transaction/',
  isLoggedIn,
  async (req, res, next) => {
    const show = req.query.show
    const completed = show == 'completed'
    let items = []
    if (show) { // show is completed or todo, so just show some items
      items =
        await Transaction_i.find({ userId: req.user._id, completed })
          .sort({ completed: 1, priority: 1, createdAt: 1 })
    } else {  // show is null, so show all of the items
      items =
        await Transaction_i.find({ userId: req.user._id })
          .sort({ completed: 1, priority: 1, createdAt: 1 })

    }
    res.render('transactionlist', { items, show, completed });
  });



/* add the value in the body to the list associated to the key */
router.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
    const new_transaction_list = new Transaction_i(
      {
        description: req.body.description,
        catagory: req.body.catagory,
        amount: req.body.amount,
        date: req.body.date,
        userId: req.user._id

      })
    await new_transaction_list.save();
    res.redirect('/transaction')
  });

router.get('/transaction/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
    console.log("inside /transaction/remove/:itemId")
    await Transaction_i.deleteOne({ _id: req.params.itemId });
    res.redirect('/transaction')
  });

// router.get('/transaction/complete/:itemId',
//   isLoggedIn,
//   async (req, res, next) => {
//     console.log("inside /transaction/complete/:itemId")
//     await Transaction_i.findOneAndUpdate(
//       { _id: req.params.itemId },
//       { $set: { completed: true } });
//     res.redirect('/transaction')
//   });

// router.get('/transaction/uncomplete/:itemId',
//   isLoggedIn,
//   async (req, res, next) => {
//     console.log("inside /transaction/complete/:itemId")
//     await Transaction_i.findOneAndUpdate(
//       { _id: req.params.itemId },
//       { $set: { completed: false } });
//     res.redirect('/transaction')
//   });

router.get('/transaction/edit/:itemId',
  isLoggedIn,
  async (req, res, next) => {
    console.log("inside /transaction/edit/:itemId")
    const item =
      await Transaction_i.findById(req.params.itemId);
    //res.render('edit', { item });
    res.locals.item = item
    res.render('edit')
    //res.json(item)
  });

router.post('/transaction/updateTransaction_i',
  isLoggedIn,
  async (req, res, next) => {
    const { description, category, amount, date, itemId, item, priority } = req.body;
    console.log("inside /transaction/complete/:itemId");
    await Transaction_i.findOneAndUpdate(
      { _id: itemId },
      { $set: { description, category, amount, date } });
    res.redirect('/transaction')
  });

// router.get('/transaction/byUser',
//   isLoggedIn,
//   async (req, res, next) => {
//     let results =
//       await Transaction_i.aggregate(
//         [
//           {
//             $group: {
//               _id: '$userId',
//               total: { $count: {} }
//             }
//           },
//           { $sort: { total: -1 } },
//         ])

//     results =
//       await User.populate(results,
//         {
//           path: '_id',
//           select: ['username', 'age']
//         })

//     //res.json(results)
//     res.render('summarizeByUser', { results })
//   });



module.exports = router;
