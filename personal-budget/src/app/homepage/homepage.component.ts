import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})

export class HomepageComponent implements AfterViewInit, OnDestroy {
  private myChart!: Chart;
  chartContainer: any;
  data: any;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.fetchDataIfNeeded().then(() => {
      this.data = this.dataService.getData();
      if (this.data && this.data.myBudget) {
        const budgets = this.data.myBudget.map((item: any) => item.budget);
        const titles = this.data.myBudget.map((item: any) => item.title);
        this.createChart(budgets, titles);
        this.createD3DonutChart(budgets, titles);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.myChart) {
      this.myChart.destroy();
    }
  }

  createChart(budgets: number[], titles: string[]) {
    if (this.myChart) {
      this.myChart.destroy();
    }
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: titles,
        datasets: [
          {
            data: budgets,
            backgroundColor: [
              'lime',
              'pink',
              'red',
              'orange',
              'skyblue',
              'violet',
              'yellow'
            ],
          },
        ],
      },
    });
  }

  createD3DonutChart(budgets: number[], titles: string[]) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const innerRadius = 100;
    const svg = d3.select('#d3DonutChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    const pie = d3.pie<number>().value((d) => d);
    const path = d3.arc<d3.PieArcDatum<number>>()
      .outerRadius(radius - 10)
      .innerRadius(innerRadius);
    const arcs = pie(budgets);
    const color = d3.scaleOrdinal<string>()
      .domain(titles)
      .range(['lime',
              'pink',
              'red',
              'orange',
              'skyblue',
              'violet',
              'yellow']);
    const arc = svg.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('fill', (d: d3.PieArcDatum<number>, i: number) => color(titles[i]))
      .attr('d', (d: d3.PieArcDatum<number>) => path(d));
    const label = svg.selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', (d: d3.PieArcDatum<number>) => `translate(${path.centroid(d)})`)
      .attr('dy', '0.35em')
      .text((d: d3.PieArcDatum<number>, i: number) => `${titles[i]}: ${d.data}`);

    label.attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'black');
  }
}
