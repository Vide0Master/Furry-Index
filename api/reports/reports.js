const prisma = require("../../systemServices/prisma")
const getUserByID = require("../../systemServices/getUserByID");
const { testUserPermission } = require("../../systemServices/userRoleControl");

exports.ROUTE = "/api/reports"

exports.INCLUDE = ["USER"]

exports.GetReports = {
    m: "get",
    e: async (req, res) => {
        if (!req.inc.user) return res.status(403).send("Restricted")
        if (!testUserPermission(req.inc.user.id, "admin:reports")) return res.status(403).send("Restricted")

        const page = req.query.p ? parseInt(req.query.p) : 0;
        const take = req.query.t ? parseInt(req.query.t) : 50;
        const count = req.query.count

        if (!count) {
            const reportList = await prisma.report.findMany({
                skip: page * take,
                take,
                orderBy: {
                    createdAt: "desc"
                }
            })

            for (const report of reportList) {
                if (report.userid != "anon") {
                    report.author = await getUserByID(report.userid, ["privateprofileparams", "email"])
                } else {
                    report.author = "anon"
                }
            }

            res.status(200).json({ reports: reportList })
        } else {
            const count = await prisma.report.count({})
            res.status(200).json({ count })
        }
    }
}

exports.ReportRegister = {
    m: "post",
    e: async (req, res) => {
        const report = await prisma.report.create({
            data: {
                userid: req?.USER?.id || "anon",
                ...req.body
            }
        })

        if (report) {
            res.status(200).send("Report registered")
        } else {
            res.status(500).send("Report register error")
        }
    }
}

exports.UpdateReport = {
    m: "put",
    e: async (req, res) => {

    }
}