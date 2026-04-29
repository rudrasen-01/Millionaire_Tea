import React from 'react';
import { motion } from 'framer-motion';
import { Users, Settings } from 'lucide-react';
import { PrimaryButton } from '../components/buttons/PrimaryButton';

export function PanelSelector({ onSelect }) {
  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-cream via-warmWhite to-cream">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 text-center shadow-xl hover:shadow-2xl transition-all" whileHover={{ y: -6 }}>
          <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center bg-gradient-to-br from-caramel to-darkBrown text-cream mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-darkBrown">User</h3>
          <p className="text-darkBrown/60 mb-4">Personal dashboard for members</p>
          <PrimaryButton onClick={() => onSelect('user')} className="bg-gradient-to-r from-caramel to-darkBrown text-cream">Enter as User</PrimaryButton>
        </motion.div>

        <motion.div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 text-center shadow-xl hover:shadow-2xl transition-all" whileHover={{ y: -6 }}>
          <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center bg-gradient-to-br from-caramel to-darkBrown text-cream mb-4">
            <Settings className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-darkBrown">Admin</h3>
          <p className="text-darkBrown/60 mb-4">System and user management</p>
          <PrimaryButton onClick={() => onSelect('admin')} className="bg-gradient-to-r from-caramel to-darkBrown text-cream">Enter as Admin</PrimaryButton>
        </motion.div>
      </div>
    </div>
  );
}

export default PanelSelector;
