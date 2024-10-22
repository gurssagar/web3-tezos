'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Web3 from 'web3';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import {DefaultSession} from "next-auth";

interface Repo {
  id: number;
  name: string;
  full_name: string;
}

interface Issue {
  id: number;
  number: number;
  title: string;
}

interface ExtendedSession {
  user: {
    username: string;
  } & DefaultSession['user'];
}

export function CreateBountyForm() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    oneLiner: "",
    description: "",
    githubRepo: "",
    githubIssue: "",
    difficulty: "",
    rewardAmount: 0,
    paymentToken: "",
    isLive: false,
  });

  React.useEffect(() => {
    const fetchRepos = async () => {
      if (session?.user && (session.user as ExtendedSession['user'])?.username) {
        try {
          const response = await fetch(`https://api.github.com/users/${(session.user as ExtendedSession['user']).username}/repos`);
          const data = await response.json();
          setRepos(data);
        } catch (error) {
          console.error('Error fetching repositories:', error);
        }
      }
    };

    fetchRepos();
  }, [session]);

  React.useEffect(() => {
    const fetchIssues = async () => {
      if (formData.githubRepo) {
        try {
          const response = await fetch(`https://api.github.com/repos/${formData.githubRepo}/issues`);
          const data = await response.json();
          setIssues(data);
        } catch (error) {
          console.error('Error fetching issues:', error);
        }
      }
    };

    fetchIssues();
  }, [formData.githubRepo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, selectName?: string) => {
    if (typeof e === 'string' && selectName) {
      setFormData(prevData => ({
        ...prevData,
        [selectName]: e
      }))
    } else if (typeof e === 'object' && 'target' in e) {
      const {name, value} = e.target
      setFormData(prevData => ({
        ...prevData,
        [name]: name === 'rewardAmount' ? Number(value) : value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (session && session.user && (session.user as ExtendedSession['user']).username) {
      try {
        // Initialize Web3
        const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');

        // Get the active account (Assuming the maintainer is connected via MetaMask or similar)
        const accounts = await web3.eth.requestAccounts();
        const account = accounts[0];

        // Get the contract instance
        const abi = require('./MyContractAbi.json');
        const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
        const contract = new web3.eth.Contract(abi, contractAddress);

        // Call the smart contract method to deposit the bounty amount
        await contract.methods.deposit(formData.rewardAmount).send({ from: account, value: web3.utils.toWei(formData.rewardAmount.toString(), 'ether') });

        console.log(`Bounty deposited with reward: ${formData.rewardAmount}`);

        // Proceed to save the bounty details in your database
        const response = await fetch('/api/create-bounty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            username: (session.user as ExtendedSession['user']).username,
          }),
        });

        if (response.ok) {
          console.log('Bounty details saved successfully');
          // Reset form data or redirect as needed
        } else {
          console.error('Failed to save bounty details');
        }
      } catch (error) {
        console.error('Error interacting with the smart contract:', error);
      }
    } else {
      console.error('User session not found');
    }
  }

  return (
      <div className="mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="mx-auto w-full lg:w-1/2">
            <h1 className="text-3xl pb-8 lg:pb-20 lg:text-6xl font-semibold text-center mt-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
              Create a Bounty
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                      id="title"
                      name="title"
                      placeholder="E.g. Fix image upload"
                      value={formData.title}
                      onChange={handleChange}
                  />
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="one-liner">One-liner</Label>
                  <Input
                      id="one-liner"
                      name="oneLiner"
                      placeholder="E.g. Fix image upload of xyz page"
                      value={formData.oneLiner}
                      onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed Description of the Bounty"
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={handleChange}
                />
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">B</Button>
                  <Button variant="outline" size="sm">I</Button>
                  <Button variant="outline" size="sm">U</Button>
                  <Button variant="outline" size="sm">{"<>"}</Button>
                  <Button variant="outline" size="sm">List</Button>
                  <Button variant="outline" size="sm">1.</Button>
                  <Button variant="outline" size="sm">A</Button>
                  <Button variant="outline" size="sm">#</Button>
                  <Button variant="outline" size="sm">Link</Button>
                  <Button variant="outline" size="sm">{"</>"}</Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="github-repo">GitHub Repo</Label>
                  <Select name="githubRepo" value={formData.githubRepo}
                          onValueChange={(value) => handleChange(value, "githubRepo")}>
                    <SelectTrigger id="github-repo">
                      <SelectValue placeholder="Select from one of your repositories"/>
                    </SelectTrigger>
                    <SelectContent>
                      {repos.map((repo) => (
                          <SelectItem key={repo.id} value={repo.full_name}>{repo.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="github-issue">GitHub Issue</Label>
                  <Select name="githubIssue" value={formData.githubIssue}
                          onValueChange={(value) => handleChange(value, "githubIssue")}>
                    <SelectTrigger id="github-issue">
                      <SelectValue placeholder="Select the issue from your repository"/>
                    </SelectTrigger>
                    <SelectContent>
                      {issues.map((issue) => (
                          <SelectItem key={issue.id} value={issue.number.toString()}>{issue.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-1/3 space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select name="difficulty" value={formData.difficulty}
                          onValueChange={(value) => handleChange(value, "difficulty")}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-1/3 space-y-2">
                  <Label htmlFor="rewardAmount">Reward Amount</Label>
                  <Input
                      id="rewardAmount"
                      name="rewardAmount"
                      type="number"
                      placeholder="1"
                      value={formData.rewardAmount}
                      onChange={handleChange}
                  />
                </div>
                <div className="w-full sm:w-1/3 space-y-2">
                  <Label htmlFor="paymentToken">Native Payment Token</Label>
                  <Input
                      id="paymentToken"
                      name="paymentToken"
                      placeholder="Select a token"
                      value={formData.paymentToken}
                      onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isLive">Make it Live</Label>
                <Select name="isLive" value={formData.isLive ? "yes" : "no"}
                        onValueChange={(value) => handleChange(value === "yes" ? "yes" : "no", "isLive")}>
                  <SelectTrigger id="isLive">
                    <SelectValue placeholder="Select option"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Continue →</Button>
              </div>
            </form>
          </div>
          <div className="w-full lg:w-1/2 lg:block hidden flex justify-center items-center">
            <DotLottieReact
                src="/dev.json"
                loop
                autoplay
            />
          </div>
        </div>
      </div>
  )
}
