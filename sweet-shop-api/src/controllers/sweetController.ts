import { Request, Response } from 'express';
import Sweet from '../models/Sweet';

// Get all sweets
export const getSweets = async (req: Request, res: Response) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sweets' });
  }
};

// Add a sweet (Admin)
export const addSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json(sweet);
  } catch (error) {
    res.status(400).json({ message: 'Error adding sweet' });
  }
};

// Update a sweet (Admin)
export const updateSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json(sweet);
  } catch (error) {
    res.status(400).json({ message: 'Error updating sweet' });
  }
};

// Delete a sweet (Admin)
export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json({ message: 'Sweet deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sweet' });
  }
};

// Purchase Sweet (Decrease Qty)
export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    if (sweet.quantity <= 0) return res.status(400).json({ message: 'Out of stock' });

    sweet.quantity -= 1;
    await sweet.save();
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing sweet' });
  }
};