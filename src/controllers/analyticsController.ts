import { Request, Response } from "express";
import { Op, fn, col, WhereOptions } from "sequelize";
import Ticket from "../models/ticketModel";
import Transaction from "../models/transactionModel";
import Counter from "../models/counterModel";
import { transactionSchema } from "../schemas/transactionSchema";

interface AttractionResult {
  total: number;
  show_name: string;
  category: string;
}

const calculateGrowth = (current: number, previous: number) =>
  previous ? ((current - previous) / previous) * 100 : 0;

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const formatHour = (date: Date) => {
  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12} ${ampm}`;
};

const formatDayOfWeek = (date: Date) => {
  return date.toLocaleString("en-US", { weekday: "short" });
};

const formatMonthDay = (date: Date) => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatISODate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const formatMonth = (date: Date) => {
  return date.toLocaleString("en-US", { month: "short" });
};

const subtractDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const subtractYears = (date: Date, years: number) => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() - years);
  return result;
};

const startOfMonth = (date: Date) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfMonth = (date: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
};

const startOfYear = (date: Date) => {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfYear = (date: Date) => {
  const d = new Date(date);
  d.setMonth(11, 31);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getTodayOverview = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const today = startOfDay(now);
    const yesterday = startOfDay(subtractDays(now, 1));
    const todayEnd = endOfDay(now);
    const yesterdayEnd = endOfDay(subtractDays(now, 1));

    const todayTickets = await Ticket.count({
      where: {
        createdAt: { [Op.gte]: today, [Op.lte]: todayEnd },
      } as WhereOptions,
    });
    const yesterdayTickets = await Ticket.count({
      where: {
        createdAt: { [Op.gte]: yesterday, [Op.lte]: yesterdayEnd },
      } as WhereOptions,
    });
    const ticketGrowth = calculateGrowth(todayTickets, yesterdayTickets);

    const todayAmount =
      (await Ticket.sum("price", {
        where: {
          createdAt: { [Op.gte]: today, [Op.lte]: todayEnd },
        } as WhereOptions,
      })) || 0;
    const yesterdayAmount =
      (await Ticket.sum("price", {
        where: {
          createdAt: { [Op.gte]: yesterday, [Op.lte]: yesterdayEnd },
        } as WhereOptions,
      })) || 0;
    const amountGrowth = calculateGrowth(todayAmount, yesterdayAmount);

    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const activeVisitors = await Ticket.count({
      where: {
        createdAt: { [Op.gte]: oneHourAgo },
      } as WhereOptions,
    });

    const attractions = (await Ticket.findAll({
      attributes: [[fn("SUM", col("price")), "total"], "show_name", "category"],
      group: ["show_name", "category"],
      where: {
        createdAt: { [Op.gte]: today, [Op.lte]: todayEnd },
      } as WhereOptions,
      raw: true,
    })) as unknown as AttractionResult[];

    const hours = Array.from({ length: 24 }, (_, i) => {
      const hourDate = new Date(today);
      hourDate.setHours(i);
      return formatHour(hourDate);
    });
    const chartData = await Promise.all(
      hours.map(async (hour, i) => {
        const hourStart = new Date(today);
        hourStart.setHours(i, 0, 0, 0);
        const hourEnd = new Date(today);
        hourEnd.setHours(i + 1, 0, 0, 0);
        const count = await Ticket.count({
          where: {
            createdAt: { [Op.gte]: hourStart, [Op.lt]: hourEnd },
          } as WhereOptions,
        });
        return { time: hour, value: count };
      })
    );

    res.json({
      totalTickets: todayTickets,
      totalAmount: `₹${todayAmount}`,
      activeVisitors,
      revenueGrowth: amountGrowth.toFixed(2),
      ticketGrowth: ticketGrowth.toFixed(2),
      attractions,
      chartData,
    });
  } catch (error) {
    console.error("Error in getTodayOverview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLast7Days = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const sevenDaysAgo = startOfDay(subtractDays(now, 7));
    const today = endOfDay(now);
    const last7DaysAgo = startOfDay(subtractDays(now, 14));
    const last7DaysEnd = endOfDay(subtractDays(now, 7));

    const tickets = await Ticket.findAll({
      where: {
        createdAt: { [Op.between]: [sevenDaysAgo, today] },
      } as WhereOptions,
    });
    const totalTickets = tickets.length;
    const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

    const last7DaysTickets = await Ticket.findAll({
      where: {
        createdAt: { [Op.between]: [last7DaysAgo, last7DaysEnd] },
      } as WhereOptions,
    });
    const last7DaysAmount = last7DaysTickets.reduce(
      (sum, ticket) => sum + ticket.price,
      0
    );
    const weekGrowth = calculateGrowth(totalAmount, last7DaysAmount);

    const dailyAverage = totalTickets / 7;

    const days = Array.from({ length: 7 }, (_, i) =>
      formatDayOfWeek(subtractDays(now, 6 - i))
    );
    const chartData = await Promise.all(
      days.map(async (day, i) => {
        const dayStart = startOfDay(subtractDays(now, 6 - i));
        const dayEnd = endOfDay(subtractDays(now, 6 - i));
        const count = await Ticket.count({
          where: {
            createdAt: { [Op.between]: [dayStart, dayEnd] },
          } as WhereOptions,
        });
        return { day, value: count };
      })
    );

    const attractions = (await Ticket.findAll({
      attributes: [[fn("SUM", col("price")), "total"], "show_name", "category"],
      group: ["show_name", "category"],
      where: {
        createdAt: { [Op.between]: [sevenDaysAgo, today] },
      } as WhereOptions,
      raw: true,
    })) as unknown as AttractionResult[];

    res.json({
      totalTickets,
      totalAmount: `₹${totalAmount}`,
      dailyAverage: dailyAverage.toFixed(2),
      weekGrowth: weekGrowth.toFixed(2),
      chartData,
      attractions,
    });
  } catch (error) {
    console.error("Error in getLast7Days:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLast30Days = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = startOfDay(subtractDays(now, 30));
    const today = endOfDay(now);
    const last30DaysAgo = startOfDay(subtractDays(now, 60));
    const last30DaysEnd = endOfDay(subtractDays(now, 30));

    const tickets = await Ticket.findAll({
      where: {
        createdAt: { [Op.between]: [thirtyDaysAgo, today] },
      } as WhereOptions,
    });
    const totalTickets = tickets.length;
    const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

    const last30DaysTickets = await Ticket.findAll({
      where: {
        createdAt: { [Op.between]: [last30DaysAgo, last30DaysEnd] },
      } as WhereOptions,
    });
    const last30DaysAmount = last30DaysTickets.reduce(
      (sum, ticket) => sum + ticket.price,
      0
    );
    const monthGrowth = calculateGrowth(totalAmount, last30DaysAmount);

    const dailyAverage = totalTickets / 30;

    const chartData = await Promise.all(
      Array.from({ length: 30 }, (_, i) => {
        const dayStart = startOfDay(subtractDays(now, 29 - i));
        const dayEnd = endOfDay(subtractDays(now, 29 - i));
        return Ticket.count({
          where: {
            createdAt: { [Op.between]: [dayStart, dayEnd] },
          } as WhereOptions,
        }).then((count) => ({
          day: formatMonthDay(subtractDays(now, 29 - i)),
          value: count,
        }));
      })
    );

    const attractions = (await Ticket.findAll({
      attributes: [[fn("SUM", col("price")), "total"], "show_name", "category"],
      group: ["show_name", "category"],
      where: {
        createdAt: { [Op.between]: [thirtyDaysAgo, today] },
      } as WhereOptions,
      raw: true,
    })) as unknown as AttractionResult[];

    const totalTicketsLast = last30DaysTickets.length;
    const dailyAverageLast = totalTicketsLast / 30;
    const monthMetrics = [
      {
        title: "Total Tickets",
        value: totalTickets,
        icon: "Ticket",
        trend: {
          value: calculateGrowth(totalTickets, totalTicketsLast).toFixed(2),
          isPositive: totalTickets >= totalTicketsLast,
        },
      },
      {
        title: "Total Amount",
        value: `₹${totalAmount}`,
        icon: "DollarSign",
        variant: "primary",
        trend: {
          value: calculateGrowth(totalAmount, last30DaysAmount).toFixed(2),
          isPositive: totalAmount >= last30DaysAmount,
        },
      },
      {
        title: "Daily Average",
        value: dailyAverage.toFixed(2),
        icon: "Users",
        variant: "success",
        trend: {
          value: calculateGrowth(dailyAverage, dailyAverageLast).toFixed(2),
          isPositive: dailyAverage >= dailyAverageLast,
        },
      },
      {
        title: "Month Growth",
        value: `${monthGrowth.toFixed(2)}%`,
        icon: "TrendingUp",
        variant: "warning",
        trend: {
          value: monthGrowth.toFixed(2),
          isPositive: monthGrowth >= 0,
        },
      },
    ];

    res.json({
      totalTickets,
      totalAmount: `₹${totalAmount}`,
      dailyAverage: dailyAverage.toFixed(2),
      monthGrowth: monthGrowth.toFixed(2),
      monthMetrics,
      chartData,
      attractions,
    });
  } catch (error) {
    console.error("Error in getLast30Days:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAnnualPerformance = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfYearDate = startOfYear(now);
    const today = endOfDay(now);
    const lastYearStart = startOfYear(subtractYears(now, 1));
    const lastYearEnd = endOfYear(subtractYears(now, 1));

    const tickets = await Ticket.findAll({
      where: {
        createdAt: { [Op.between]: [startOfYearDate, today] },
      } as WhereOptions,
    });
    const totalTickets = tickets.length;
    const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

    const lastYearTickets = await Ticket.findAll({
      where: {
        createdAt: { [Op.between]: [lastYearStart, lastYearEnd] },
      } as WhereOptions,
    });
    const lastYearAmount = lastYearTickets.reduce(
      (sum, ticket) => sum + ticket.price,
      0
    );
    const annualGrowth = calculateGrowth(totalAmount, lastYearAmount);

    const monthlyAverage = totalTickets / 12;

    const months = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(now.getFullYear(), i, 1);
      return formatMonth(monthDate);
    });
    const chartData = await Promise.all(
      months.map(async (month, i) => {
        const monthStart = startOfMonth(new Date(now.getFullYear(), i, 1));
        const monthEnd = endOfMonth(new Date(now.getFullYear(), i, 1));
        const count = await Ticket.count({
          where: {
            createdAt: { [Op.between]: [monthStart, monthEnd] },
          } as WhereOptions,
        });
        return { month, value: count };
      })
    );

    const attractions = (await Ticket.findAll({
      attributes: [[fn("SUM", col("price")), "total"], "show_name", "category"],
      group: ["show_name", "category"],
      where: {
        createdAt: { [Op.between]: [startOfYearDate, today] },
      } as WhereOptions,
      raw: true,
    })) as unknown as AttractionResult[];

    res.json({
      totalTickets,
      totalAmount: `₹${totalAmount}`,
      monthlyAverage: monthlyAverage.toFixed(2),
      annualGrowth: annualGrowth.toFixed(2),
      chartData,
      attractions,
    });
  } catch (error) {
    console.error("Error in getAnnualPerformance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCalendarView = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Start and end dates are required" });
    }

    const transactions = await Transaction.findAll({
      where: {
        date: {
          [Op.between]: [new Date(start as string), new Date(end as string)],
        },
      } as WhereOptions,
      include: [
        { model: Ticket, as: "ticket" },
        { model: Counter, as: "counter" },
      ],
    });

    const totalSales = transactions.length;
    const totalAmount = transactions.reduce(
      (sum, transaction) => sum + transaction.total_paid,
      0
    );

    const calendarData = transactions.map((transaction, index) => ({
      id: transaction.id, // Include the actual transaction ID
      sNo: index + 1,
      invoiceNo:
        transaction.invoice_no ||
        `TICKET${transaction.id.toString().padStart(4, "0")}`,
      date: formatISODate(new Date(transaction.date)),
      showName: transaction.ticket?.show_name || "Unknown",
      category: transaction.category || "Unknown",
      counter: transaction.counter?.username || "N/A",
      adult: transaction.adult_count,
      child: transaction.child_count,
      totalPaid: `₹${transaction.total_paid}.00`,
    }));

    res.json({
      totalSales,
      totalAmount: `₹${totalAmount}`,
      transactions: calendarData,
    });
  } catch (error) {
    console.error("Error in getCalendarView:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = transactionSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Validate and convert id to number
    const transactionId = parseInt(id, 10);
    if (isNaN(transactionId)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findByPk(transactionId, {
      include: [{ model: Ticket, as: "ticket" }],
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update transaction fields
    const updateData: any = {
      adult_count: req.body.adult_count ?? transaction.adult_count,
      child_count: req.body.child_count ?? transaction.child_count,
      category: req.body.category ?? transaction.category,
      total_paid: req.body.total_paid ?? transaction.total_paid,
      date: req.body.date ? new Date(req.body.date) : transaction.date,
    };

    // Update associated ticket if show_name or price is provided
    if (req.body.show_name || req.body.total_paid) {
      const ticket = transaction.ticket;
      if (ticket) {
        await ticket.update({
          show_name: req.body.show_name ?? ticket.show_name,
          price: req.body.total_paid ?? ticket.price,
          category: req.body.category ?? ticket.category,
        });
      } else {
        return res.status(400).json({ message: "Associated ticket not found" });
      }
    }

    await transaction.update(updateData);

    res.json({
      message: "Transaction updated successfully",
      transaction: {
        id: transaction.id,
        invoice_no: transaction.invoice_no,
        date: transaction.date,
        adult_count: transaction.adult_count,
        child_count: transaction.child_count,
        category: transaction.category,
        total_paid: transaction.total_paid,
        ticket_id: transaction.ticket_id,
        counter_id: transaction.counter_id,
        show_name: transaction.ticket?.show_name,
      },
    });
  } catch (error) {
    console.error("Error in updateTransaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate and convert id to number
    const transactionId = parseInt(id, 10);
    if (isNaN(transactionId)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Optionally delete the associated ticket
    if (transaction.ticket_id) {
      await Ticket.destroy({ where: { id: transaction.ticket_id } });
    }

    // Delete the transaction
    await transaction.destroy();

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
