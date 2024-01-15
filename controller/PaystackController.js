const BankAccount = require("../models/FinanceReport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");
const https = require("https");
var https2 = require('follow-redirects').https;

function PaystackController(){
    const newCustomer  = async (req, res) => {
        try {
            // Get user input
            const { firstName, lastName, phone, email } = req.body;

            // Validate user input
            if (!(firstName && lastName && phone)) {
                return res.status(400).json({ status: "error", msg: "First Name, Last Name and Phone are compulsory in creating an account"});
            }

            // Create new customer on Paystack Dashboard
            const params = JSON.stringify({
                email,
                "first_name": firstName,
                "last_name": lastName,
                phone,

            })

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/customer',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }

            const request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({status: "error", msg: error})
            })

            request.write(params)
            request.end()


        } catch (err) {
            console.log(err);
        }
    }

    const allCustomers  = async (req, res) => {
        try {
            // Get user input
            const { perPage, page, } = req.params;

            // Create new customer on Paystack Dashboard
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/customer`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            const request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    console.log(JSON.parse(data))
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const getCustomer  = async (req, res) => {
        try {
            // Get user input
            const { email_or_code, } = req.params;

            console.log({email_or_code})

            // Create new customer on Paystack Dashboard
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/customer/${email_or_code}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            let data = ''
            const request = https.request(options, response => {
                // let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                    console.log({data})
                });

                response.on('end', () => {
                    console.log(JSON.parse(data))
                    return  res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({status: "error", msg: error})
            })

            // request.write(params)
            request.end()


        } catch (err) {
            console.log(err);
        }
    }

    const editCustomer  = async (req, res) => {
        try {
            // Get user input
            const { firstName, lastName, phone, } = req.body;

            const { code, } = req.params;

            // Create new customer on Paystack Dashboard
            const params = JSON.stringify({
                "first_name": firstName,
                "last_name": lastName,
                phone,

            })

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/customer/${code}`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }

            const request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                   return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({status: "error", msg: error})
            })

            request.write(params)
            request.end()


        } catch (err) {
            console.log(err);
        }
    }

    const validateCustomer  = async (req, res) => {
        try {
            // Get user input
            const { firstName, lastName, middle_name, type = "bank_account", bank_code = "058", account_number, country = "NG", bvn,  } = req.body;

            const { code, } = req.params;

            // Create new customer on Paystack Dashboard
            const params = JSON.stringify({
                "country": country,
                "type": type,
                "account_number": account_number,
                "bvn": bvn,
                "bank_code": bank_code,
                "first_name": firstName,
                "last_name": lastName,
                "middle_name": middle_name,
            })

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/customer/{customer_code}/identification',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }

            const request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({status: "error", msg: error})
            })

            request.write(params)
            request.end()


        } catch (err) {
            console.log(err);
        }
    }

    const listBanks  = async (req, res) => {
        try {
            // Get user input
            // const { firstName, lastName, middle_name, type = "bank_account", bank_code, account_number, country = "NG", bvn,  } = req.body;

            const { country="nigeria", } = req.query;

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/bank?country=${country?.toLowerCase()}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            const request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({status: "error", msg: error})
            })

            request.end()


        } catch (err) {
            console.log(err);
        }
    }

    const listCountries  = async (req, res) => {
        try {

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/country',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            let request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end()


        } catch (err) {
            console.log(err);
        }
    }

    const listStates  = async (req, res) => {
        try {

            const { country="CA" } = req.query;

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path:   `/address_verification/states?country=${country}`,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer SECRET_KEY'
                }
            }

            let request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end()


        } catch (err) {
            console.log(err);
        }
    }

    const newVirtualAccount  = async (req, res) => {
        try {

            const { customer } = req.body;

            const params = JSON.stringify({
                "customer": customer,
                "preferred_bank": "wema-bank"
            })

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/dedicated_account',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }

            let request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.write(params)
            request.end()


        } catch (err) {
            console.log(err);
        }
    }

    const newCustomerAndVirtualAccount  = async (req, res) => {
        try {

            const { email, phone, first_name, last_name, middle_name, bvn } = req.body;

            var options = {
                method: 'POST',
                hostname: 'api.paystack.co',
                path: '/dedicated_account/assign',
                headers: {
                    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                maxRedirects: 20
            };

            var request = https.request(options, function (response) {
                var chunks = [];

                response.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                response.on("end", function (chunk) {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                    return res.json(JSON.parse(body.toString()))
                });

                response.on("error", function (error) {
                    console.error(error);
                    return res.json({ status: "error", msg: error})
                });
            });

            var postData = JSON.stringify({
                email: email,
                first_name: first_name,
                // middle_name: middle_name,
                last_name: last_name,
                phone: phone,
                bvn,
                "preferred_bank": "wema-bank",
                "country": "NG"
            });

            request.write(postData);

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const listVirtualAccounts  = async (req, res) => {
        try {

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/dedicated_account',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            const request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const fetchVirtualAccounts  = async (req, res) => {
        try {

            const { id } = req.params;

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/dedicated_account/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            const request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }


    const requeryDedicatedAccount  = async (req, res) => {
        try {

            const { accountNumber } = req.params;

            var options = {
                'method': 'GET',
                'hostname': 'api.paystack.co',
                'path': `/dedicated_account/requery?account_number=${accountNumber}&provider_slug=wema-bank&date=2023-07-07}`,
                'headers': {
                    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                'maxRedirects': 20
            };

            var request = https.request(options, function (response) {
                var chunks = [];

                response.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                response.on("end", function (chunk) {
                    var body = Buffer.concat(chunks);
                    return res.send(body.toString());
                    // return res.json(JSON.parse(body.toString()))
                });

                response.on("error", function (error) {
                    return res.json({ status: "error", msg: error})
                });
            });


            request.end();


        } catch (err) {
            console.log(err);
        }
    }


    const listAllTransactions  = async (req, res) => {
        try {

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transaction',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })


            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const fetchTransactionDetails  = async (req, res) => {
        try {

            const { id } = req.params;

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/transaction/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const initiateTransfer  = async (req, res) => {
        try {

            const { reason, amount, recipient } = req.body;

            console.log({ reason, amount, recipient })

            const params = JSON.stringify({
                source: "balance",
                reason: reason,
                amount:Number(amount),
                recipient: recipient,
            })

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transfer',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }

            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.write(params)
            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const finalizeTransfer  = async (req, res) => {
        try {

            const { reason, amount, recipient } = req.params;

            const params = JSON.stringify({
                source: "balance",
                reason: reason,
                amount:amount,
                recipient: recipient,
            })

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transfer',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }

            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            req.write(params)
            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const listTransfers  = async (req, res) => {
        try {

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transfer',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const listCustomerTransfers  = async (req, res) => {
        try {

            const { customer } = req.params;

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/transfer/${customer}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const fetchTransfer  = async (req, res) => {
        try {

            const { id_or_code } = req.params;

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/transfer/${id_or_code}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const verifyTransfer  = async (req, res) => {
        try {

            const { reference } = req.params;

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transfer/verify/:reference',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }


            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const resolveAccountNumber  = async (req, res) => {
        try {

            const { account_number, bank_code } = req.params;

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }


            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const createTransferRecipient  = async (req, res) => {
        try {

            const { name, account_number, bank_code } = req.body;

            const params = JSON.stringify({
                type:"nuban",
                name : name,
                account_number: account_number,
                bank_code: bank_code,
                currency: "NGN"
            })

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transferrecipient',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }


            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.write(params)
            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const listTransferRecipients  = async (req, res) => {
        try {

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transferrecipient',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const fetchTransferRecipient  = async (req, res) => {
        try {

            const { id_or_code } = req.params;

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/transferrecipient/${id_or_code}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            var request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({ status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }


    return { newCustomer, allCustomers, getCustomer, editCustomer, validateCustomer, listBanks,
    listCountries, listStates, newVirtualAccount, newCustomerAndVirtualAccount, listVirtualAccounts,
    fetchVirtualAccounts, requeryDedicatedAccount, listAllTransactions, fetchTransactionDetails,
    initiateTransfer, finalizeTransfer, listTransfers, listCustomerTransfers, fetchTransfer,
    verifyTransfer, resolveAccountNumber, createTransferRecipient, listTransferRecipients,
    fetchTransferRecipient,  }
}

module.exports = PaystackController
