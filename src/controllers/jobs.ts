import { Request, Response } from 'express';

const { Pool } = require('pg');
const dbParams = require('../../lib/db.ts');
const db = new Pool(dbParams);
db.connect();

const getJobs = async (req: Request, res: Response) => {
  const sql = 'SELECT * FROM jobs';
  const { rows } = await db.query(sql);
  return res.status(200).json({
    message: rows
  })
}

const getJob = async (req: Request, res: Response) => {
  const id: string = req.params.id
  const sql = `SELECT * FROM jobs WHERE id = ${id}`
  const { rows } = await db.query(sql);
  return res.status(200).json({
    message: rows
  })
}

const addJob = async (req: Request, res: Response) => {
  const title = req.body.title
  const description = req.body.description
  const location = req.body.location
  const hourlyPay = req.body.hourly_pay_rate
  const sql = `INSERT INTO jobs (title, description, location, hourly_pay_rate) VALUES ($1, $2, $3, $4)`
  const response = await db.query(sql, [title, description, location, hourlyPay])
  return res.status(200).json({
    message: 'Job successfully created!'
  })
}

const updateJob = async (req: Request, res: Response) => {
  interface Params {
    title?: string;
    description?: string;
    location?: string;
    hourly_pay_rate?: number;
    [key: string]: any;
  }
  const id = req.params.id
  const updatedAt = new Date()

  const params: Params = { 
    'title': req.body.title, 
    'description': req.body.description, 
    'location': req.body.location, 
    'hourly_pay_rate': req.body.hourly_pay_rate
  }

  let valueString = 'updated_at = NOW(),'
  for (let key in params) {
    if (params[key]) {
      valueString += `${key} = '${params[key]}',`
    }
  }
  valueString = valueString.slice(0, valueString.length - 1)
  const sql = `UPDATE jobs SET ${valueString} WHERE id = ${id}`
  const response = await db.query(sql)
  return res.status(200).json({
    message: 'Job successfully updated'
  })
}

const deleteJob = async (req: Request, res: Response) => {
  const id: string = req.params.id
  const sql = `DELETE FROM jobs WHERE id = ${id}`
  const response = await db.query(sql)
  return res.status(200).json({
    message: 'Job successfully deleted'
  })
}

export default { getJobs, getJob, addJob, updateJob, deleteJob, db }