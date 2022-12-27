// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { INewsCategory, INewsHeadline } from './interfaces/INews';
import fetch from 'node-fetch'

const API_URL = 'https://api.londonmarket.xyz/';
let marketHeadlines: Array<INewsHeadline> = new Array();
let currentHeadline: INewsHeadline = {} as INewsHeadline;

let newsStatusBarItem = vscode.window.createStatusBarItem(
	vscode.StatusBarAlignment.Left,
	999
);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('initializing');

	const showMarketHeadlinesCommandId = 'showMarketHeadlines';
	newsStatusBarItem.command = showMarketHeadlinesCommandId;
	context.subscriptions.push(newsStatusBarItem);

	const categories = await fetchMarketHeadlines();
    categories.map(i => {
		return marketHeadlines.push(...i.Headlines);
	});
		
	if (marketHeadlines.length === 0 || marketHeadlines === null || marketHeadlines === undefined) {
		console.log('Failed to fetch headlines');
		newsStatusBarItem.show();
		newsStatusBarItem.tooltip = 'Attempting again...';
		newsStatusBarItem.text = `Failed to fetch market headlines, attempting again...`;
	}

	console.log(`Found ${marketHeadlines.length} results`);

	updateNewsTicker();
	setInterval(updateNewsTicker, 5000);

	context.subscriptions.push(
		vscode.commands.registerCommand(showMarketHeadlinesCommandId, async () => {
			vscode.env.openExternal(vscode.Uri.parse(currentHeadline.StoryLink));
		})
	);
}

const updateNewsTicker = async () => {
	const randomHeadline: INewsHeadline = marketHeadlines[Math.floor(Math.random() * marketHeadlines.length)];
	currentHeadline = randomHeadline;

	newsStatusBarItem.show();
	newsStatusBarItem.tooltip = 'Test';
	newsStatusBarItem.text = `${currentHeadline.Headline}`;
}

const fetchMarketHeadlines = async (): Promise<Array<INewsCategory>> => {
	const response = await fetch(`${API_URL}news/headlines/market`);
	const data = response.json() as Promise<INewsCategory[]>;
	return data;
};

// This method is called when your extension is deactivated
export function deactivate() {}
