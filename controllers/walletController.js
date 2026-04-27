//@desc Get user wallet balance
//@route GET /api/wallet/
//@access Private

import Wallet from "../models/Wallet.js";

export const getWalletBalance = async (req, res) => {
    try {
        //req.user._id is the ID of the logged-in user, set by the protect middleware(the protect bouncer)
        const wallet = await Wallet.findOne({ user: req.user._id });

        if(wallet) {
            console.log(`Wallet balance checked for User ID: ${req.user._id}, Balance: ${wallet.balance}`);
            res.status(200).json({
                user: req.user.name,
                balance: wallet.balance,
                currency: wallet.currency
            });
        } else {
            res.status(404).json({ msg: "Wallet not found" });
        }
    } catch (error) {
        console.error(`Error fetching wallet balance for User ID: ${req.user._id}`, error);
        res.status(500).json({ msg: "Server error while fetching wallet balance" });
    }
}

//@desc Add money to wallet
//@route POST /api/wallet/deposit
//@access Private
export const depositMoney = async (req, res) => {
    try {
        const { amount } = req.body;

        if(!amount || amount <= 0) {
            return res.status(400).json({ msg: "Please provide a valid amount to deposit." });
        }

        // Find the wallet and update the balance atomically
        const wallet = await Wallet.findOne({ user: req.user._id });

        if(wallet) {
            wallet.balance += amount;
            await wallet.save();

            console.log(`Successfully deposited ${amount} to User ID: ${req.user._id}, New Balance: ${wallet.balance}`);

            res.status(200).json({
                message : `Successfully deposited ${amount} to your wallet.`,
                newBalance: wallet.balance
            });
        } else {
            res.status(404).json({ msg: "Wallet not found" });
        }
    } catch (error) {
        console.error(`Error depositing money for User ID: ${req.user._id}`, error);
        res.status(500).json({ msg: "Server error while depositing money" });
    }
}