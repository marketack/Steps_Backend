import User from '../models/User.js';

// ✅ Admin: Update any user's isPro status
export const updateUserProStatus = async (req, res) => {
  try {
    const { isPro } = req.body;
    const { id } = req.params;

    if (typeof isPro !== 'boolean') {
      return res.status(400).json({ message: 'isPro must be true or false.' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.isPro = isPro;
    await user.save();

    res.status(200).json({
      message: `User ${user.email} is now ${isPro ? 'a Pro user' : 'not a Pro user'}.`,
      user: {
        id: user._id,
        email: user.email,
        isPro: user.isPro,
      },
    });
  } catch (err) {
    console.error('❌ Error updating isPro status:', err);
    res.status(500).json({ message: 'Server error while updating user status.' });
  }
};

// ✅ Get current user's profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      isPro: user.isPro,
      isAdmin: user.isAdmin,
      verified: user.verified,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update current user's profile
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true
    }).select('-password');
    res.json({
      id: updated._id,
      email: updated.email,
      username: updated.username,
      isPro: updated.isPro,
      isAdmin: updated.isAdmin,
      verified: updated.verified,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete current user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Admin: Get all users
export const getAllUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const users = await User.find().select('-password');
    const response = users.map(user => ({
      id: user._id,
      email: user.email,
      username: user.username,
      isPro: user.isPro,
      isAdmin: user.isAdmin,
      verified: user.verified,
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
