// const anchor = require('@project-serum/anchor');

// // Read the generated IDL.
// const idl = JSON.parse(require('fs').readFileSync('./target/idl/myepicproject.json', 'utf8'));

// // Address of the deployed program.
// const programIdLiteral = '8BgZp17gyuSK1DZ24ULkwsRnri6kJrQyDjq4ygCmEVqB';
// const programId = new anchor.web3.PublicKey(programIdLiteral);

// // Generate the program client from IDL.
// const program = new anchor.Program(idl, programId);

// // Execute the RPC.
// const tx = await program.rpc.initialize();


console.log("got here");
const anchor = require('@project-serum/anchor');

const { SystemProgram } = anchor.web3;

// Configure the local cluster.
// anchor.setProvider(anchor.Provider.local()); // env()?
const provider = anchor.Provider.env();
anchor.setProvider(provider);

async function main() {
  // #region main
  // Read the generated IDL.
  const idl = JSON.parse(require('fs').readFileSync('./target/idl/myepicproject.json', 'utf8'));

  // Address of the deployed program.
  const programIdLiteral = '8BgZp17gyuSK1DZ24ULkwsRnri6kJrQyDjq4ygCmEVqB';
  const programId = new anchor.web3.PublicKey(programIdLiteral);

  // Generate the program client from IDL.
  const program = new anchor.Program(idl, programId);

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Execute the RPC.
  try {
    const tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    // #endregion main
    console.log("📝 Your transaction signature", tx);

    // Fetch data from the account.
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString())

    // Call add_gif!
    await program.rpc.addGif("https://media.giphy.com/media/eoVusT7Pi9ODe/giphy.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    // Call the account.
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString())

    // Access gif_list on the account!
    console.log('👀 GIF List', account.gifList)

  } catch (err) {
    console.log(err);
  }

}

console.log('Running client.');
main().then(() => console.log('Success'));