/**
 * CLI pour Ollama Client
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { OllamaClient, createClient } from './client.js';
import { DEFAULT_OLLAMA_CONFIG, MODEL_PRESETS, type ModelPreset } from './config.js';

const program = new Command();

program
  .name('ollama-cli')
  .description('Client Ollama standardisé: generate, chat, batch, translate, models')
  .version('1.0.0');

let client: OllamaClient;

function getClient(options: any): OllamaClient {
  if (!client) {
    client = createClient({
      baseUrl: options.baseUrl,
      timeout: options.timeout,
      maxRetries: options.retries,
      defaultModel: options.model,
    });
  }
  return client;
}

program
  .command('generate')
  .description('Générer une réponse')
  .argument('<prompt>', 'Prompt à envoyer')
  .option('-m, --model <model>', 'Modèle à utiliser', DEFAULT_OLLAMA_CONFIG.defaultModel)
  .option('-s, --system <system>', 'System prompt')
  .option('--temperature <n>', 'Temperature', '0.7')
  .option('--top-p <n>', 'Top P', '0.9')
  .option('--max-tokens <n>', 'Max tokens', '2048')
  .option('--stream', 'Mode streaming', false)
  .option('--base-url <url>', 'URL Ollama', DEFAULT_OLLAMA_CONFIG.baseUrl)
  .option('--timeout <ms>', 'Timeout ms', String(DEFAULT_OLLAMA_CONFIG.timeout))
  .option('--retries <n>', 'Max retries', String(DEFAULT_OLLAMA_CONFIG.maxRetries))
  .action(async (prompt, options) => {
    const spinner = ora('Génération...').start();
    const c = getClient(options);
    
    try {
      if (options.stream) {
        spinner.stop();
        let fullResponse = '';
        for await (const chunk of c.generateStream({
          model: options.model,
          prompt,
          system: options.system,
          options: {
            temperature: parseFloat(options.temperature),
            topP: parseFloat(options.topP),
            numPredict: parseInt(options.maxTokens),
          },
        })) {
          process.stdout.write(chunk.response);
          fullResponse += chunk.response;
          if (chunk.done) break;
        }
        console.log('');
      } else {
        const response = await c.generate({
          model: options.model,
          prompt,
          system: options.system,
          options: {
            temperature: parseFloat(options.temperature),
            topP: parseFloat(options.topP),
            numPredict: parseInt(options.maxTokens),
          },
        });
        spinner.succeed('Terminé');
        console.log(chalk.green('\nRéponse:'));
        console.log(response.response);
        console.log(chalk.gray(`\nDurée: ${response.totalDuration}ms, Tokens: ${response.evalCount}`));
      }
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('chat')
  .description('Chat interactif')
  .option('-m, --model <model>', 'Modèle à utiliser', DEFAULT_OLLAMA_CONFIG.defaultModel)
  .option('-s, --system <system>', 'System prompt')
  .option('--base-url <url>', 'URL Ollama', DEFAULT_OLLAMA_CONFIG.baseUrl)
  .action(async (options) => {
    const c = getClient(options);
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
    
    if (options.system) {
      messages.push({ role: 'system', content: options.system });
    }
    
    console.log(chalk.cyan('Chat mode - Ctrl+C pour quitter\n'));
    
    while (true) {
      const { default: readline } = await import('readline');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      
      const userInput = await new Promise<string>(resolve => {
        rl.question(chalk.blue('Vous: '), resolve);
      });
      rl.close();
      
      if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') break;
      
      messages.push({ role: 'user', content: userInput });
      
      try {
        process.stdout.write(chalk.green('Assistant: '));
        let fullResponse = '';
        for await (const chunk of c.chatStream({
          model: options.model,
          messages: messages as any,
        })) {
          process.stdout.write(chunk.message.content);
          fullResponse += chunk.message.content;
          if (chunk.done) break;
        }
        console.log('\n');
        messages.push({ role: 'assistant', content: fullResponse });
      } catch (error) {
        console.error(chalk.red('\nErreur:'), error);
      }
    }
  });

program
  .command('batch')
  .description('Traitement par lots')
  .argument('<file>', 'Fichier JSON avec array de prompts')
  .option('-m, --model <model>', 'Modèle', DEFAULT_OLLAMA_CONFIG.defaultModel)
  .option('-c, --concurrency <n>', 'Concurrence', '3')
  .option('-o, --output <file>', 'Fichier sortie JSON')
  .option('--base-url <url>', 'URL Ollama', DEFAULT_OLLAMA_CONFIG.baseUrl)
  .action(async (file, options) => {
    const { readFileSync, writeFileSync } = await import('fs');
    const spinner = ora('Traitement par lots...').start();
    const c = getClient(options);
    
    try {
      const prompts = JSON.parse(readFileSync(file, 'utf-8'));
      const requests = prompts.map((p: string) => ({ model: options.model, prompt: p }));
      
      const result = await c.batchGenerate({
        requests,
        concurrency: parseInt(options.concurrency),
        onProgress: (completed, total) => {
          spinner.text = `Traitement: ${completed}/${total}`;
        },
      });
      
      spinner.succeed(`Terminé: ${result.results.length} requêtes, ${result.errors} erreurs, ${result.totalDuration}ms`);
      
      if (options.output) {
        writeFileSync(options.output, JSON.stringify(result, null, 2), 'utf-8');
        console.log(chalk.green(`Résultats sauvés: ${options.output}`));
      }
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('translate')
  .description('Traduire un texte')
  .argument('<text>', 'Texte à traduire')
  .option('-s, --source <lang>', 'Langue source', 'fr')
  .option('-t, --target <lang>', 'Langue cible', 'en')
  .option('-m, --model <model>', 'Modèle', DEFAULT_OLLAMA_CONFIG.defaultModel)
  .option('--context <text>', 'Contexte additionnel')
  .option('--glossary <file>', 'Fichier JSON glossaire')
  .option('--base-url <url>', 'URL Ollama', DEFAULT_OLLAMA_CONFIG.baseUrl)
  .action(async (text, options) => {
    const spinner = ora('Traduction...').start();
    const c = getClient(options);
    
    try {
      let glossary: Record<string, string> | undefined;
      if (options.glossary) {
        const { readFileSync } = await import('fs');
        glossary = JSON.parse(readFileSync(options.glossary, 'utf-8'));
      }
      
      const result = await c.translate({
        text,
        sourceLang: options.source,
        targetLang: options.target,
        context: options.context,
        glossary,
        model: options.model,
      });
      
      spinner.succeed(`Traduction terminée (${result.duration}ms)`);
      console.log(chalk.green('\nTraduction:'));
      console.log(result.translatedText);
      if (result.tokensUsed) console.log(chalk.gray(`Tokens: ${result.tokensUsed}`));
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('models')
  .description('Lister modèles disponibles')
  .option('--base-url <url>', 'URL Ollama', DEFAULT_OLLAMA_CONFIG.baseUrl)
  .action(async (options) => {
    const spinner = ora('Récupération modèles...').start();
    const c = getClient(options);
    
    try {
      const models = await c.listModels();
      spinner.succeed(`${models.length} modèle(s) trouvé(s)`);
      
      console.log(chalk.bold('\nModèles installés:'));
      for (const m of models) {
        const sizeGB = (m.size / 1024 / 1024 / 1024).toFixed(2);
        console.log(`  ${chalk.cyan(m.name)} - ${sizeGB} GB - ${m.details?.parameterSize || ''}`);
      }
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('pull')
  .description('Télécharger un modèle')
  .argument('<model>', 'Nom du modèle (ex: qwen2.5:3b)')
  .option('--base-url <url>', 'URL Ollama', DEFAULT_OLLAMA_CONFIG.baseUrl)
  .option('--stream', 'Afficher progression', true)
  .action(async (model, options) => {
    const c = getClient(options);
    
    try {
      console.log(chalk.cyan(`Téléchargement ${model}...`));
      await c.pullModel(model, options.stream);
      console.log(chalk.green('\nModèle téléchargé avec succès'));
    } catch (error) {
      console.error(chalk.red('Erreur:'), error);
      process.exit(1);
    }
  });

program
  .command('delete')
  .description('Supprimer un modèle')
  .argument('<model>', 'Nom du modèle')
  .option('--base-url <url>', 'URL Ollama', DEFAULT_OLLAMA_CONFIG.baseUrl)
  .action(async (model, options) => {
    const spinner = ora(`Suppression ${model}...`).start();
    const c = getClient(options);
    
    try {
      await c.deleteModel(model);
      spinner.succeed('Modèle supprimé');
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('health')
  .description('Vérifier santé Ollama')
  .option('--base-url <url>', 'URL Ollama', DEFAULT_OLLAMA_CONFIG.baseUrl)
  .action(async (options) => {
    const spinner = ora('Vérification...').start();
    const c = getClient(options);
    
    const healthy = await c.healthCheck();
    if (healthy) {
      spinner.succeed('Ollama est accessible');
    } else {
      spinner.fail('Ollama inaccessible');
      process.exit(1);
    }
  });

program
  .command('presets')
  .description('Afficher presets de modèles recommandés')
  .action(() => {
    console.log(chalk.bold('\nModèles recommandés:'));
    for (const [key, preset] of Object.entries(MODEL_PRESETS)) {
      console.log(`  ${chalk.cyan(key)}: ${preset.size} | Vitesse: ${preset.speed} | Qualité: ${preset.quality}`);
    }
    console.log('');
  });

program.parse();