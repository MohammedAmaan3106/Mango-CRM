const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("V-Square CRM Backend Running");
});

app.get("/members", (req, res) => {
  db.query("SELECT * FROM members", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

app.post("/members", (req, res) => {
  const {
    name,
    phone,
    plan,
    start_date,
    end_date,
    status,
  } = req.body;

  db.query(
    `INSERT INTO members
    (name, phone, plan, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      name,
      phone,
      plan,
      start_date,
      end_date,
      status,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Member Added Successfully",
      });
    }
  );
});
app.delete("/members/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM members WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Member Deleted Successfully",
      });
    }
  );
});

app.put("/members/:id", (req, res) => {
  const id = req.params.id;

  const {
    name,
    phone,
    plan,
    start_date,
    end_date,
    status,
  } = req.body;

  db.query(
    `UPDATE members
     SET name = ?,
         phone = ?,
         plan = ?,
         start_date = ?,
         end_date = ?,
         status = ?
     WHERE id = ?`,
    [
      name,
      phone,
      plan,
      start_date,
      end_date,
      status,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Member Updated Successfully",
      });
    }
  );
});
app.post("/payments", (req, res) => {
  const {
    member_id,
    amount,
    payment_date,
    payment_method,
  } = req.body;

  db.query(
    `INSERT INTO payments
    (member_id, amount, payment_date, payment_method)
    VALUES (?, ?, ?, ?)`,
    [
      member_id,
      amount,
      payment_date,
      payment_method,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Payment Added Successfully",
      });
    }
  );
});
app.get("/payments", (req, res) => {
  db.query(
    `SELECT
      payments.id,
      members.name,
      payments.amount,
      payments.payment_date,
      payments.payment_method
    FROM payments
    JOIN members
      ON payments.member_id = members.id
    ORDER BY payments.id DESC`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
});
app.get("/revenue", (req, res) => {
  db.query(
    "SELECT SUM(amount) AS totalRevenue FROM payments",
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result[0]);
    }
  );
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});