sed -i '/SPDX-License-Identifier:/d' ./contracts/flatten/MiscanthusCoreFlatten.sol
sed -i '1s/^/\/\/ SPDX-License-Identifier: MIT\n/' ./contracts/flatten/MiscanthusCoreFlatten.sol
sed -i 's/ ether/ * 10**6/g' ./contracts/flatten/MiscanthusCoreFlatten.sol
sed -i 's/isContract/isContract2/g' ./contracts/flatten/MiscanthusCoreFlatten.sol

sed -i '/SPDX-License-Identifier:/d' ./contracts/flatten/StablecoinFlatten.sol
sed -i '1s/^/\/\/ SPDX-License-Identifier: MIT\n/' ./contracts/flatten/StablecoinFlatten.sol
sed -i 's/ ether/ * 10**6/g' ./contracts/flatten/StablecoinFlatten.sol
sed -i 's/isContract/isContract2/g' ./contracts/flatten/StablecoinFlatten.sol