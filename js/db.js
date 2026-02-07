// 数据库操作封装
import { supabase } from './supabase.js'

// 员工操作
export const employees = {
  list: async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },
  add: async (name) => {
    const { error } = await supabase
      .from('employees')
      .insert([{ name }])
    if (error) throw error
  },
  delete: async (id) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

// 产品操作
export const products = {
  list: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },
  add: async (data) => {
    const { error } = await supabase
      .from('products')
      .insert([data])
    if (error) throw error
  },
  update: async (id, data) => {
    const { error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
    if (error) throw error
  },
  delete: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
  importBatch: async (records) => {
    const { error } = await supabase
      .from('products')
      .upsert(records)
    if (error) throw error
  }
}

// 销售记录操作
export const salesRecords = {
  list: async (month) => {
    let query = supabase
      .from('sales_records')
      .select(`
        *,
        employee:employees(name),
        product:products(name, code, price)
      `)
      .order('created_at', { ascending: false })

    if (month) {
      // 动态计算月末日期（处理2月等小月份）
      const [year, m] = month.split('-')
      const daysInMonth = new Date(year, m, 0).getDate()
      const startDate = `${month}-01`
      const endDate = `${month}-${daysInMonth}`
      query = query.gte('record_date', startDate).lte('record_date', endDate)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },
  add: async (data) => {
    const { error } = await supabase
      .from('sales_records')
      .insert([data])
    if (error) throw error
  },
  delete: async (id) => {
    const { error } = await supabase
      .from('sales_records')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}
